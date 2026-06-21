import { NextResponse } from "next/server";
import { listarPagamentos } from "../../../server/grpcClient";

export async function GET() {
  const pagamentos = await listarPagamentos();
  return NextResponse.json(pagamentos);
}
