import { RaiseError } from "@/lib/error";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

type RequestParamsType = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params }: RequestParamsType) {
  const todoId = parseInt(params.id);
  try {
    const { rows } = await sql`SELECT * FROM  todos WHERE id=${todoId};`;
    if (rows.length === 0) {
      return NextResponse.json(
        {
          error: `TODO with "${todoId}" does not exists`,
          success: false,
          data: [],
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        { data: rows[0], success: true },
        { status: 200 }
      );
    }
  } catch (error) {
    RaiseError(error);
  }
}

export async function PUT(req: Request, { params: { id } }: RequestParamsType) {
  try {
    const { updateValue } = await req.json();
    const result =
      await sql`UPDATE todos SET title=${updateValue} WHERE id=${id}`;
    console.log("🚀 ~ PUT ~ result:", result);
    return NextResponse.json(
      { message: "success", success: true, id: id, title: updateValue },
      { status: 200 }
    );
  } catch (error) {
    RaiseError(error);
  }
}

export async function DELETE(
  req: Request,
  { params: { id } }: RequestParamsType
) {
  try {
    await sql`DELETE FROM todos WHERE id=${id} CASCADE`;

    return NextResponse.json(
      { message: "success", success: true },
      { status: 200 }
    );
  } catch (error) {
    RaiseError(error);
  }
}
