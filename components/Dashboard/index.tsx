"use client";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Loading from "@/components/Loading";

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
  const [newBtnClicked, setNewBtnClicked] = useState<boolean>(false);
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
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);
  const handleCreate = async (): Promise<void> => {
    setNewBtnClicked(true);
    return await fetch("/api/todo", {
      method: "POST",
      body: JSON.stringify({ title: "untitled" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNewBtnClicked(false);
        router.push(`/new/${data.id}`);
      })
      .catch((error) => {
        setError(error);
        router.push("/");
      });
  };

  return (
    <div className="flex flex-wrap h-full w-full">
      <div className="p-5" onClick={handleCreate}>
        <Button className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white">
          {newBtnClicked ? <Loading /> : <AddIcon />}
        </Button>
      </div>
      {!loading &&
        todoList.length > 0 &&
        todoList.map((eachTodo) => (
          <Link key={uuidv4()} href={`/new/${eachTodo.id}`}>
            <div className="p-5">
              <Button className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white">
                {eachTodo.title}
              </Button>
            </div>
          </Link>
        ))}
      {loading && (
        <Loading className="flex justify-center items-center h-full w-full" />
      )}
      {error.length > 0 && <div>{error}</div>}
    </div>
  );
}
