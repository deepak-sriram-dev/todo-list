"use client";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Loading from "@/components/Loading";
import { createTodo, deleteTodo, getList } from "./api";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface TodoItemsInterface {
  id: number;
  title: String;
}

export default function Dashboard(): JSX.Element {
  const router = useRouter();
  const [todoList, setTodoList] = useState<TodoItemsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [newBtnClicked, setNewBtnClicked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
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
        if (data.success) {
          setNewBtnClicked(false);
          router.push(`/new/${data.id}`);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => {
        setError(error);
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
    handleCloseDropdown();
    setDeleteLoading(true);
    deleteTodo(selectedTodoId)
      .then((res) => res.json())
      .then((data) => {
        list();
        setDeleteLoading(false);
      });
  };
  return (
    <div className="flex flex-wrap h-full w-full" data-testid="dashboard-main">
      {error !== "" && notFound()}

      <div className="p-5" onClick={handleCreate} data-testid="addBtn">
        <Button
          id="addBtn"
          aria-label="Add button"
          className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white"
        >
          {newBtnClicked ? (
            <Loading loadingProps={{ color: "inherit", size: 20 }} />
          ) : (
            <AddIcon titleAccess="add-icon-btn" />
          )}
        </Button>
      </div>
      {todoList.length > 0 &&
        todoList.map((eachTodo) => (
          <div key={eachTodo.id} className="p-5">
            <Button
              disabled={selectedTodoId === eachTodo.id && deleteLoading}
              className="flex cursor-default justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold text-white relative"
            >
              {selectedTodoId === eachTodo.id && deleteLoading ? (
                <Loading loadingProps={{ color: "inherit" }} />
              ) : (
                <div data-testid="link-card-div">
                  <Link
                    aria-label={`todo-id-${eachTodo.id}`}
                    key={uuidv4()}
                    href={`/new/${eachTodo.id}`}
                    className="cursor-pointer"
                  >
                    {eachTodo.title}
                  </Link>
                  <IconButton
                    aria-label="dropdown-more"
                    id="long-button"
                    onClick={(e) => handleDropdown(e, eachTodo.id)}
                    className="absolute top-2 right-2"
                    color="inherit"
                  >
                    <MoreVertIcon />
                  </IconButton>{" "}
                </div>
              )}
            </Button>
          </div>
        ))}
      <Menu
        key={selectedTodoId}
        id="long-menu"
        MenuListProps={{ "aria-labelledby": "long-button" }}
        anchorEl={anchorEl}
        open={openDropdown}
        onClose={handleCloseDropdown}
      >
        <MenuItem aria-label="dropdown-menu-item" onClick={handleDeleteTodo}>
          Delete
        </MenuItem>
      </Menu>
      {loading && (
        <Loading className="flex justify-center items-center h-full w-full" />
      )}
    </div>
  );
}
