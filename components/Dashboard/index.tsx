"use client";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { v4 as uuidv4 } from "uuid";

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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getList()
      .then((res) => res.json())
      .then((data) => {
        setTodoList(data.rows);
        setLoading(false);
      })
      .catch((error) => {
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
        router.push(`/new/${data.id}`);
      })
      .catch((error) => {
        router.push("/");
      });
  };

  return (
    <div className="flex flex-wrap h-full w-full">
      {loading && (
        <div className="flex justify-center items-center h-full w-full">
          <CircularProgress />{" "}
        </div>
      )}
      {!loading && (
        <div className="p-5">
          <Button
            onClick={handleCreate}
            className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white"
          >
            <AddIcon />
          </Button>
        </div>
      )}
      {!loading &&
        todoList.length > 0 &&
        todoList.map((eachTodo) => (
          <div className="p-5" key={uuidv4()}>
            <Button className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white">
              <Link href={`/new/${eachTodo.id}`}>{eachTodo.title} </Link>
            </Button>
          </div>
        ))}
    </div>
  );
}
