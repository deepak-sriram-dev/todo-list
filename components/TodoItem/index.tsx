"use client";
import React, { KeyboardEvent, useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { v4 as uuidv4 } from "uuid";
import Loading from "../Loading";
import {
  TodoItemCheckListInterface,
  TodoItemPropsInterface,
} from "./interface";
import { createTodoItemAPI, getTodoItems } from "./api";
import TodoFormController from "./TodoFormController";

export default function TodoItem({
  todoId,
}: TodoItemPropsInterface): JSX.Element {
  const [todoItems, setTodoItems] = useState<TodoItemCheckListInterface[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [listItemLoading, setListItemLoading] = useState<boolean>(false);

  const list = () => {
    getTodoItems(todoId)
      .then((res) => res.json())
      .then((data) => {
        setTodoItems(data.rows);
        setListItemLoading(false);
      })
      .catch((error) => {
        setError(`ERROR: ${JSON.stringify(error)} or Something went wrong`);
        setListItemLoading(false);
      });
  };

  useEffect(() => {
    setListItemLoading(true);
    list();
  }, []);

  const handleEnter = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      setLoading(true);
      const target = event.target as HTMLInputElement;
      createTodoItemAPI(target.value, todoId)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLoading(false);
            list();
          } else {
            setLoading(false);
            setError(data.message);
          }
        })
        .catch((error) => {
          setError(`ERROR: ${JSON.stringify(error)} or Something went wrong`);
          setLoading(false);
        });
    }
  };

  return (
    <div className="flex flex-col p-5 mt-10 h-full">
      <FormGroup>
        <div key={uuidv4()} className="flex items-center mb-2 p-2">
          <FormControlLabel
            control={<Checkbox />}
            label={
              <TextField
                disabled={loading}
                className="w-[400px]"
                id="outlined-basic"
                variant="outlined"
                label="list item"
                autoComplete="off"
                onKeyDown={(e: KeyboardEvent) => handleEnter(e)}
              />
            }
          />
          {loading && <Loading loadingProps={{ size: 15 }} />}
        </div>
        {listItemLoading ? (
          <Loading
            loadingProps={{ size: 25 }}
            className="flex justify-center"
          />
        ) : (
          todoItems.map((item) => (
            <TodoFormController
              key={uuidv4()}
              item={item}
              todoId={todoId}
              setTodoItems={setTodoItems}
              setError={setError}
              setListItemLoading={setListItemLoading}
            />
          ))
        )}
      </FormGroup>
      {error && <div>{error}</div>}
    </div>
  );
}
