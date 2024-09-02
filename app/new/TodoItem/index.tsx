"use client";
import { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

export default function TodoItem(): JSX.Element {
  const [todoItem, setTodoItem] = useState<string>("");

  return (
    <div className="flex flex-col p-5 mt-10 h-full">
      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          label={
            <TextField
              className="w-[500px]"
              id="filled-basic"
              variant="filled"
              autoComplete="off"
              value={todoItem}
            />
          }
        />
      </FormGroup>
    </div>
  );
}
