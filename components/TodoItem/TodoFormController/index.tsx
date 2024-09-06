import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Loading from "@/components/Loading";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { TodoItemCheckListInterface } from "../interface";
import { deleteTodoItem, updateTodoItem } from "./api";
import { getTodoItems } from "../api";

interface TodoFormControllerInterface {
  item: TodoItemCheckListInterface;
  todoId: number;
  setListItemLoading: Function;
  setTodoItems: Function;
  setError: Function;
}

export default function TodoFormController(props: TodoFormControllerInterface) {
  const { item, todoId, setListItemLoading, setTodoItems, setError } = props;
  const [deleteItemLoading, setDeleteItemLoading] = useState<boolean>(false);
  const [deleteItem, setDeleteItem] = useState<number>(0);

  const list = () => {
    getTodoItems(todoId)
      .then((res) => res.json())
      .then((data) => {
        setTodoItems(data.rows);
        setListItemLoading(false);
      })
      .catch((error) => {
        setError(`ERROR: ${JSON.stringify(error)} or Something went wrong`);
        setListItemLoading(false);
      });
  };

  const handleDelete = ({ id }: TodoItemCheckListInterface): void => {
    setDeleteItem(id);
    setDeleteItemLoading(true);
    deleteTodoItem(todoId, id).then(() => list());
  };

  const handleCheck = (id: number): void => {
    console.log("🚀 ~ handleCheck ~ id:", id);

    updateTodoItem(todoId, id, "is_checked", false)
      .then((res) => res.json())
      .then((data) => {
        console.log("🚀 ~ updateTodoItem ~ data:", data);
      });
  };

  return (
    <div className="flex items-center mb-2 p-2">
      <FormControlLabel
        className="mr-0"
        control={
          <Checkbox
            checked={item.is_checked}
            onClick={(): void => handleCheck(item.id)}
          />
        }
        label={
          <TextField
            className="w-[400px]"
            id="outlined-basic"
            variant="outlined"
            label="list item"
            autoComplete="off"
            value={item.todo_item}
          />
        }
      />

      {deleteItem === item.id && deleteItemLoading ? (
        <Loading className="ml-5" loadingProps={{ size: 15 }} />
      ) : (
        <Button color="inherit" onClick={(): void => handleDelete(item)}>
          <DeleteIcon />
        </Button>
      )}
    </div>
  );
}
