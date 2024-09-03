"use client";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import NavBar from "@/app/Navbar";
import { TodoContext } from "./contextProvider";

const inter = Inter({ subsets: ["latin"] });

// const metadata: Metadata = {
//   title: "TODO",
//   description: "Make It Happen: Your ToDo List Success Companion",
// };

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
