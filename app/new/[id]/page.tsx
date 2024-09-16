"use client";
import { KeyboardEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import TodoItem from "@/components/TodoItem";
import CloseIcon from "@mui/icons-material/Close";
import { useTodoContext } from "@/app/todoContext";
import { notFound } from "next/navigation";
import { getTodo, updateTodo } from "./api";
import Loading from "@/components/Loading";

interface PropsInterface {
  params: {
    id: string;
  };
}

export default function New({ params }: PropsInterface): JSX.Element {
  const todoId = parseInt(params.id);
  const { todoName, setTodoName } = useTodoContext();
  const [tempValue, setTempValue] = useState<string>(todoName);
  const [error, setError] = useState<string>("");
  const [emptyError, setEmptyError] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getTodo(todoId)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTodoName(data.data.title);
          setTempValue(data.data.title);
        } else {
          setError(data.error);
          setTodoName("");
        }
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  useEffect(() => {
    if (tempValue !== todoName) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  }, [tempValue]);

  const handleSave = (): void => {
    if (tempValue === "") {
      setEmptyError(true);
    } else {
      setShowIcon(false);
      setLoading(true);
      updateTodo(todoId, tempValue)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLoading(false);
            setTodoName(data.title);
            setEmptyError(false);
          }
        });
    }
  };

  const handleSaveByEnter = (pressedKey: string): void => {
    if (pressedKey === "Enter") {
      handleSave();
    }
  };

  const handleClose = (): void => {
    setTempValue(todoName);
    setTodoName(todoName);
  };

  return (
    <div className="h-full w-full flex justify-center">
      <div className="shadow-[0_0_3px_0_gray] w-[50%] flex min-h-[calc(1000px-120px)] p-4">
        <div className="flex flex-col w-full p-2">
          <div className="flex">
            <TextField
              className="w-[300px]"
              id="outlined-basic todo-item-text-field-id"
              label="Name"
              autoComplete="off"
              variant="outlined"
              value={tempValue}
              error={emptyError}
              helperText={emptyError && "todo name can't be null"}
              onKeyDown={(e: KeyboardEvent): void => handleSaveByEnter(e.key)}
              onChange={(e) => setTempValue(e.target.value)}
            />
            {showIcon && (
              <div
                data-testid="save-delete-icons-todo"
                className="flex items-center ml-1 h-full"
              >
                <DoneIcon
                  onClick={handleSave}
                  className="!h-12 !w-12 p-3 cursor-pointer hover:bg-slate-300 hover:rounded-3xl"
                  id="title-btns"
                />
                <CloseIcon
                  onClick={handleClose}
                  className="h-[50px] w-[50px] p-3 cursor-pointer hover:bg-slate-300 hover:rounded-3xl"
                  id="title-btns"
                />
              </div>
            )}
            {loading && (
              <Loading
                className="flex justify-center items-center p-5"
                loadingProps={{ size: 20 }}
              />
            )}
          </div>
          <TodoItem todoId={todoId} />
        </div>
        {error.length > 0 && (
          <div className="flex justify-center items-center w-full h-full text-xl font-bold">
            <p>{notFound()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
