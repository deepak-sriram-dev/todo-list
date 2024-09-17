import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Loading from "@/components/Loading";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { KeyboardEvent, useEffect, useState } from "react";
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
  const [itemLoading, setItemLoading] = useState<boolean>(false);
  const [itemId, setItemId] = useState<number>(0);
  const [tempValue, setTempValue] = useState<string>("");
  const [textFieldEnabled, settextFieldEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!textFieldEnabled && tempValue.length) {
      settextFieldEnabled(true);
    }
  }, [tempValue.length]);

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

  const updateQuery = (
    itemId: number,
    column: string,
    value: string | boolean
  ): void => {
    updateTodoItem(todoId, itemId, column, value)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          list();
        } else {
          setError(data.error);
        }
        setItemLoading(false);
      })
      .catch((error) => {
        setItemLoading(false);
        setError(`ERROR: ${JSON.stringify(error)} or Something went wrong`);
      });
  };

  const handleDelete = async ({
    id,
  }: TodoItemCheckListInterface): Promise<void> => {
    setItemLoading(true);
    setItemId(id);
    await deleteTodoItem(todoId, id)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          list();
        } else {
          setError(`Error: ${data.error}`);
        }
      })
      .catch((error) => {
        setError(`Error - ${JSON.stringify(error)} or Something went wrong`);
      });

    setItemLoading(false);
  };

  const handleCheck = (id: number): void => {
    setItemLoading(true);
    setItemId(id);

    updateQuery(id, "is_checked", !item.is_checked);
  };

  const handleItemChange = (e: any, id: number): void => {
    setItemId(id);
    setItemLoading(false);
    setTempValue(e.target.value);
  };

  const handleUpdate = (e: KeyboardEvent): void => {
    if (e.key === "Enter") {
      setItemLoading(true);
      updateQuery(itemId, "todo_item", tempValue);
    }
  };

  return (
    <div
      className="flex items-center mb-2 p-2"
      data-testid={`todoItem-${item.id}`}
    >
      <FormControlLabel
        className="mr-0"
        control={
          <Checkbox
            checked={item.is_checked}
            disabled={itemLoading}
            id={`todoItem-${item.id}-checkbox`}
            onClick={(): void => handleCheck(item.id)}
          />
        }
        label={
          <TextField
            aria-label={`createTodoItem-${item.id}`}
            disabled={itemLoading || item.is_checked}
            className="w-[400px]"
            id={`standard-basic todoItem-${item.id}`}
            variant="standard"
            label={`todoItem-${item.id}`}
            autoComplete="off"
            value={textFieldEnabled ? tempValue : item.todo_item}
            onChange={(e) => handleItemChange(e, item.id)}
            onKeyDown={handleUpdate}
          />
        }
      />

      {itemId === item.id && itemLoading ? (
        <Loading className="ml-5" loadingProps={{ size: 15 }} />
      ) : (
        <Button
          id="delete-icon"
          color="inherit"
          onClick={(): Promise<void> => handleDelete(item)}
        >
          <DeleteIcon />
        </Button>
      )}
    </div>
  );
}
