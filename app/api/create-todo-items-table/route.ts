import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result = await sql`CREATE TABLE todo_items (
            ID serial,
            todo_id INT,
            todo_item varchar(255),
            is_checked boolean,
            is_deleted boolean,
            PRIMARY KEY(ID),
            CONSTRAINT fk_todos
            FOREIGN KEY (todo_id)
            REFERENCES todos (id)
          )`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
