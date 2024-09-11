"use client";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Loading from "@/components/Loading";
import { createTodo, deleteTodo, getList } from "./api";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface DashboardInterface {
  id: number;
  title: String;
}

export default function Dashboard(): JSX.Element {
  const router = useRouter();
  const [todoList, setTodoList] = useState<DashboardInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newBtnClicked, setNewBtnClicked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [dropdownClicked, setDropdownClicked] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDropdown = Boolean(anchorEl);
  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);

  const list = (): void => {
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
  };

  useEffect(() => {
    list();
    setLoading(true);
  }, []);

  const handleCreate = async (): Promise<void> => {
    setNewBtnClicked(true);
    return createTodo()
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

  const handleDropdown = (
    event: React.MouseEvent<HTMLElement>,
    id: number
  ): void => {
    setAnchorEl(event.currentTarget);
    setSelectedTodoId(id);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const handleDeleteTodo = (): void => {
    deleteTodo(selectedTodoId)
      .then((res) => res.json())
      .then((data) => {
        console.log("🚀 ~ .then ~ data:", data);
        list();
      });
  };

  return (
    <div className="flex flex-wrap h-full w-full">
      <div className="p-5" onClick={handleCreate}>
        <Button className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white">
          {newBtnClicked ? (
            <Loading loadingProps={{ color: "inherit", size: 20 }} />
          ) : (
            <AddIcon />
          )}
        </Button>
      </div>
      {!loading &&
        todoList.length > 0 &&
        todoList.map((eachTodo) => (
          <div className="p-5">
            <Button className="flex cursor-default justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white relative">
              <Link
                key={uuidv4()}
                href={`/new/${eachTodo.id}`}
                className="cursor-pointer"
              >
                {eachTodo.title}
              </Link>
              <IconButton
                aria-label="more"
                id="long-button"
                onClick={(e) => handleDropdown(e, eachTodo.id)}
                className="absolute top-2 right-2"
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
            </Button>
          </div>
        ))}
      {loading && (
        <Loading className="flex justify-center items-center h-full w-full" />
      )}
      {error.length > 0 && <div>{error}</div>}

      <Menu
        id="long-menu"
        MenuListProps={{ "aria-labelledby": "long-button" }}
        anchorEl={anchorEl}
        open={openDropdown}
        onClose={handleCloseDropdown}
      >
        <MenuItem onClick={handleDeleteTodo}>Delete</MenuItem>
      </Menu>
    </div>
  );
}
