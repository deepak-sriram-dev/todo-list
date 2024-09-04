import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result =
      await sql`CREATE TABLE todos(ID serial, title varchar(200) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(ID))`;
    console.log("🚀 ~ GET ~ result:", result);
    await sql`CREATE TABLE todo_items (
      ID serial,
      todo_id INT,
      todo_item varchar(255),
      is_checked boolean,
      is_deleted boolean,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(ID),
      CONSTRAINT fk_todos
      FOREIGN KEY (todo_id)
      REFERENCES todos (id)
    )`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json({ error }, { status: 200 });
  }
}
