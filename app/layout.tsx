"use client";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useContext, createContext, useState } from "react";
import NavBar from "@/app/Navbar";
import { TodoContextInterface } from "./interface";

const inter = Inter({ subsets: ["latin"] });

export const TodoContext = createContext<TodoContextInterface>({
  todoName: "",
  setTodoName: () => {},
});

// export const metadata: Metadata = {
//   title: "TODO",
//   description: "Make It Happen: Your ToDo List Success Companion",
// };

export function useTodoContext(): TodoContextInterface {
  return useContext(TodoContext);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [todoName, setTodoName] = useState<string>("");
  return (
    <html lang="en">
      <body className={`min-h-screen ${inter.className}`}>
        <TodoContext.Provider value={{ todoName, setTodoName }}>
          <NavBar />
          <div>{children}</div>
        </TodoContext.Provider>
      </body>
    </html>
  );
}
