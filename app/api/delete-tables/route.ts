import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result =
      await sql`DROP TABLE todos, todo_items CASCADE`;
    console.log("🚀 ~ GET ~ result:", result);
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json({ error }, { status: 200 });
  }
}
