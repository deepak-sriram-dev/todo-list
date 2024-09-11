import { Button } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[calc(80vh-0px)]">
      <div className="p-5">
        <h1 className="text-xl font-bold">Page Not Found - 404!</h1>
      </div>
      <Button variant="contained" color="error" className="capitalize">
        <Link href={"/"}>Go back to dashboard</Link>
      </Button>
    </div>
  );
}
