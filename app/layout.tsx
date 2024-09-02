"use client";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import * as React from "react";
import NavBar from "@/app/Navbar";
import { TodoContextInterface } from "./interface";

const inter = Inter({ subsets: ["latin"] });
export const TodoContext = React.createContext("");

// export const metadata: Metadata = {
//   title: "TODO",
//   description: "Make It Happen: Your ToDo List Success Companion",
// };

export function useTodoContext() {
  return React.useContext(TodoContext);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [todoName, setTodoName] = React.useState<string>("");
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
