import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result =
      await sql`CREATE TABLE todos(ID serial, title varchar(200) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(ID))`;
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
      REFERENCES todos (id) ON DELETE CASCADE
    )`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 200 });
  }
}
