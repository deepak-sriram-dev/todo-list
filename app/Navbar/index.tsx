"use client";
import * as React from "react";
const TodoContext = React.createContext("");

export default function NavBar(): JSX.Element {
  const [todoName, setTodoName] = React.useState<string>("");
  return (
    <TodoContext.Provider value={{ todoName } as unknown as string}>
      <div className="flex items-center p-3 text-left text-white bg-slate-500 shadow-[0_2px_10px_3px_#a748ea] h-[80px]">
        TODO
      </div>
    </TodoContext.Provider>
  );
}
