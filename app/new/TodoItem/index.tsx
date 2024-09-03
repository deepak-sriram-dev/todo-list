"use client";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";

export default function TodoItem(): JSX.Element {
  const [todoItems, setTodoItems] = useState<string[]>([""]);
  const [tempValue, setTempValue] = useState<string>("");

  const handleChange = (event: any): void => {
    setTempValue(event?.target?.value);

    if (event?.key && event?.key === "Enter") {
      setTodoItems([...todoItems, event?.target?.value]);
      setTempValue("");
    }
  };

  const handleRemoveItem = (item: string): void => {
    setTodoItems((prev) => prev.filter((i) => i !== item));
  };

  return (
    <div className="flex flex-col p-5 mt-10 h-full">
      <FormGroup>
        {todoItems.map(
          (item: string): JSX.Element => (
            <div key={uuidv4()} className="flex items-center mb-2 p-2">
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <TextField
                    className="w-[500px]"
                    id="outlined-basic"
                    variant="outlined"
                    label="list item"
                    autoComplete="off"
                    value={item.length > 0 ? item : tempValue}
                    onKeyDown={(e: KeyboardEvent) => handleChange(e)}
                    onChange={(
                      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => handleChange(e)}
                  />
                }
              />
              {item.length > 0 && (
                <div onClick={(): void => handleRemoveItem(item)}>
                  <DeleteIcon className="h-10 w-10 p-2 cursor-pointer hover:bg-slate-300 hover:rounded-3xl" />
                </div>
              )}
            </div>
          )
        )}
      </FormGroup>
    </div>
  );
}
