import { createContext } from "react";
import { TodoContextInterface } from "@/app/todoContext";

export const TodoContext = createContext<TodoContextInterface>({
  todoName: "",
  setTodoName: () => {},
});
