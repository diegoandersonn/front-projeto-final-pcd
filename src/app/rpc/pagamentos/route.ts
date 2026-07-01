import { NextResponse } from "next/server";
import { listarPagamentos } from "../../../server/grpcClient";

export async function GET() {
  try {
    const pagamentos = await listarPagamentos();
    return NextResponse.json(pagamentos);
  } catch (error) {
    console.error("Erro ao listar pagamentos", error);
    return NextResponse.json({ error: "Erro ao listar pagamentos." }, { status: 500 });
  }
}
