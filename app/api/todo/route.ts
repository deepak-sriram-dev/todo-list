import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title } = await req.json();

  try {
    const { rows } =
      await sql`INSERT INTO todos (title) VALUES (${title})RETURNING *;`;

    console.log("🚀 ~ POST ~ result:", rows);
    if (rows.length !== 0) {
      // return NextResponse.redirect(new URL("/new", req.url));
      return NextResponse.json(
        { message: "success", success: true },
        { status: 200 }
      );
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { rows } = await sql`SELECT * FROM todos`;
    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
