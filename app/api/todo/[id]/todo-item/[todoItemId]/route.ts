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

    if (updateColumn === "is_checked") {
      await sql`UPDATE todo_items SET is_checked=${updateValue} WHERE todo_id = ${id} AND id = ${todoItemId}`;
    } else if (updateColumn === "todo_item") {
      await sql`UPDATE todo_items SET todo_item=${updateValue} WHERE todo_id = ${id} AND id = ${todoItemId}`;
    }

    return NextResponse.json(
      { message: "success", success: true },
      { status: 200 }
    );
  } catch (error) {
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
