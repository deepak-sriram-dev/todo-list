import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';

export default function Home() {
  return (
    <main className="flex flex-col p-8">
      <div className="flex justify-center items-center shadow-lg p-4 bg-slate-400 rounded-md w-[200px] h-[200px] text-2xl font-bold cursor-pointer text-white">
        <Link href="/new"><AddIcon /></Link>
      </div>
    </main>
  );
}
