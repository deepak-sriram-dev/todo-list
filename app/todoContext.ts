import { useContext } from "react";
import { TodoContext } from "@/app/contextProvider";

export interface TodoContextInterface {
  todoName: string;
  setTodoName: Function;
}

export function useTodoContext(): TodoContextInterface {
  return useContext(TodoContext);
}
