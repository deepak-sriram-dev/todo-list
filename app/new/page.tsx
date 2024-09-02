import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import TodoItem from "./TodoItem";

export default function New(): JSX.Element {
  return (
    <div className="h-full w-full flex justify-center">
      <div className="shadow-[0_0_3px_0_gray] w-[50%] flex min-h-[calc(1000px-120px)] p-4">
        <div className="flex flex-col w-full p-2">
          <div>
            <TextField
              className="w-[300px]"
              id="filled-basic"
              label="Name"
              autoComplete="off"
              variant="filled"
            />
            <DoneIcon className="text-center h-[50px] w-[50px] p-3 cursor-pointer hover:bg-slate-300 hover:rounded-3xl" />
          </div>
          <TodoItem />
        </div>
      </div>
    </div>
  );
}
