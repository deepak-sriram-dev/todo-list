"use client";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardInterface {
  id: number;
  title: String;
}

export async function getList(): Promise<Response> {
  return await fetch("/api/todo", {
    method: "GET",
  });
}

export default function Dashboard(): JSX.Element {
  const router = useRouter();
  const [todoList, setTodoList] = useState<DashboardInterface[]>([]);

  useEffect(() => {
    getList()
      .then((res) => res.json())
      .then((data) => {
        setTodoList(data.rows);
      })
      .catch((error) => {
        console.log("🚀 ~ getList ~ error:", error);
      });
  }, []);

  console.log("🚀 ~ Dashboard ~ todoList:", todoList);

  const handleCreate = async (): Promise<void> => {
    return await fetch("/api/todo", {
      method: "POST",
      body: JSON.stringify({ title: "untitled" }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🚀 ~ Home ~ data:", data);
        router.push("/new");
      })
      .catch((error) => {
        console.log("🚀 ~ Home ~ error:", error);
        router.push("/");
      });
  };
  return (
    <div className="flex flex-wrap">
      <div className="p-5">
        <Button
          onClick={handleCreate}
          className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white"
        >
          <AddIcon />
        </Button>
      </div>
      {todoList.length > 0 &&
        todoList.map((eachTodo) => (
          <div className="p-5">
            <Button className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white">
              {eachTodo.title}
            </Button>
          </div>
        ))}
    </div>
  );
}
