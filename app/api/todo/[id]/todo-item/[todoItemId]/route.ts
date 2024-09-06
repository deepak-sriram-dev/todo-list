import { RaiseError } from "@/lib/error";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

type RequestParamsType = {
  params: {
    id: string;
    todoItemId: string;
  };
};

export async function PUT(
  req: Request,
  { params: { id, todoItemId } }: RequestParamsType
) {
  try {
    const { updateColumn, updateValue } = await req.json();

    const query = `UPDATE todo_items SET ${sql(updateColumn)} = ${sql(
      updateValue
    )} WHERE todo_id = ${id} AND id = ${todoItemId};`;

    const result = await sql`${query}`;
    console.log("🚀 ~ result:", result);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    RaiseError(error);
  }
}

export async function DELETE(
  req: Request,
  { params: { id, todoItemId } }: RequestParamsType
) {
  try {
    await sql`DELETE FROM todo_items WHERE id = ${todoItemId} and todo_id = ${id}`;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    RaiseError(error);
  }
}
