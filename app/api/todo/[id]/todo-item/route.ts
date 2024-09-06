import { RaiseError } from "@/lib/error";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

type RequestParamsType = {
  params: {
    id: string;
  };
};

export async function POST(
  req: Request,
  { params: { id } }: RequestParamsType
) {
  try {
    const { itemName } = await req.json();
    console.log("🚀 ~ itemName:", itemName);

    const { rows } =
      await sql`INSERT INTO todo_items(todo_id, todo_item, is_checked, is_deleted) VALUES(${id}, ${itemName}, ${false}, ${false}) RETURNING *;`;

    console.log("🚀 ~ rows:", rows);
    if (rows.length !== 0) {
      const { id, todoItem, isChecked } = rows[0];
      return NextResponse.json(
        { id, todoItem, isChecked, success: true },
        { status: 200 }
      );
    } else {
      throw new Error("something went wrong");
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    RaiseError(error);
  }
}

export async function GET(req: Request, { params: { id } }: RequestParamsType) {
  try {
    const { rows } =
      await sql`SELECT * FROM todo_items WHERE todo_id = ${id} AND is_deleted = false`;
    return NextResponse.json({ rows, success: true }, { status: 200 });
  } catch (error) {
    RaiseError(error);
  }
}
