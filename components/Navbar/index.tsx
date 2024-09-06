import { useTodoContext } from "@/app/todoContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loading from "../Loading";

export default function NavBar(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const { todoName, setTodoName } = useTodoContext();
  const path = usePathname();
  const isNewPage = path.includes("/new");

  useEffect(() => {
    if (todoName.length === 0 && isNewPage) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [todoName]);

  return (
    <div className="flex items-center p-3 text-left text-white bg-slate-500 shadow-[0_2px_10px_3px_#a748ea] h-[80px]">
      <Link
        href="/"
        className="cursor-pointer"
        onClick={(): void => setTodoName("")}
      >
        TODO
      </Link>
      {loading && (
        <Loading
          loadingProps={{ size: 25, color: "inherit", className: "ml-2" }}
        />
      )}
      {todoName && isNewPage && `-> ${todoName}`}
    </div>
  );
}
