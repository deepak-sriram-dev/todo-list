"use client";
import { KeyboardEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import TodoItem from "@/app/new/TodoItem";
import CloseIcon from "@mui/icons-material/Close";
import { useTodoContext } from "@/app/layout";

export default function New(): JSX.Element {
  const [tempValue, setTempValue] = useState<string>("");
  const [showIcon, setShowIcon] = useState<boolean>(false);
  let { todoName, setTodoName } = useTodoContext();

  useEffect(() => {
    if (tempValue !== todoName) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  }, [tempValue]);

  const handleSave = (): void => {
    setTodoName(tempValue);
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
              id="filled-basic"
              label="Name"
              autoComplete="off"
              variant="filled"
              value={tempValue}
              onKeyDown={(e: KeyboardEvent): void => handleSaveByEnter(e.key)}
              onChange={(e) => setTempValue(e.target.value)}
            />
            {showIcon && (
              <div className="flex items-center ml-1 h-full">
                <DoneIcon
                  onClick={handleSave}
                  className="!h-12 !w-12 p-3 cursor-pointer hover:bg-slate-300 hover:rounded-3xl"
                  id='title-btns'
                />
                <CloseIcon
                  onClick={handleClose}
                  className="h-[50px] w-[50px] p-3 cursor-pointer hover:bg-slate-300 hover:rounded-3xl"
                  id='title-btns'
                />
              </div>
            )}
          </div>
          <TodoItem />
        </div>
      </div>
    </div>
  );
}
