// "use client";
import { usePathname } from "next/navigation";
import { useTodoContext } from "@/app/layout";
import Link from "next/link";

export default function NavBar(): JSX.Element {
  const { todoName, setTodoName } = useTodoContext();
  const pathName = usePathname();
  // const [routeName, setRouteName] = useState<string>("");
  // useEffect(() => {
  //   const route = pathName.split("/");
  //   if (route.length > 1) {
  //     setRouteName(route[1]);
  //   }
  // }, []);

  return (
    <div className="flex items-center p-3 text-left text-white bg-slate-500 shadow-[0_2px_10px_3px_#a748ea] h-[80px]">
      <Link
        href="/"
        className="cursor-pointer"
        onClick={(): void => setTodoName("")}
      >
        TODO
      </Link>
      {`-> ${todoName}`}
      {/* {routeName.length > 0 && `-> ${todoContext.todoName}`} */}
    </div>
  );
}
