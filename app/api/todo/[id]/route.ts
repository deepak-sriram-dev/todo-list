import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

type RequestParamsType = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params }: RequestParamsType) {
  try {
    const { rows } = await sql`SELECT * FROM  todos WHERE id = ${params.id};`;
    return NextResponse.json({ data: rows[0], success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
