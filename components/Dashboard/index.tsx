"use client";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

interface TodoItemsInterface {
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
  const [todoList, setTodoList] = useState<TodoItemsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getList()
      .then((res) => res.json())
      .then((data) => {
        if (Object.keys(data.rows).length === 0) {
          setTodoList([]);
        } else {
          setTodoList(data.rows);
        }
        setLoading(false);
      });
  }, []);

  const handleCreate = async (): Promise<void> => {
    return await fetch("/api/todo", {
      method: "POST",
      body: JSON.stringify({ title: "untitled" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          router.push(`/new/${data.id}`);
        } else {
          setError("Something went wrong");
          router.push("/");
        }
      })
      .catch((error) => {
        setError(error);
        router.push("/");
      });
  };

  return (
    <div className="flex flex-wrap h-full w-full">
      <div className="p-5">
        <Button
          onClick={handleCreate}
          id="addBtn"
          className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white"
        >
          <AddIcon titleAccess="add-icon-btn" />
        </Button>
      </div>
      {todoList.length > 0 &&
        todoList.map((eachTodo) => (
          <div className="p-5" key={uuidv4()}>
            <Button className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white">
              <Link href={`/new/${eachTodo.id}`}>{eachTodo.title} </Link>
            </Button>
          </div>
        ))}
      {loading && (
        <div className="flex justify-center items-center h-full w-full">
          <CircularProgress />{" "}
        </div>
      )}
      {error.length > 0 && (
        <div className="flex justify-center items-center h-full w-full">
          {error}
        </div>
      )}
    </div>
  );
}
