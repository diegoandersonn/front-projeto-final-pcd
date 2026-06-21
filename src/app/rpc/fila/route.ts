import { NextResponse } from "next/server";
import { listarMensagensFila } from "../../../server/grpcClient";

export async function GET() {
  const mensagens = await listarMensagensFila();
  return NextResponse.json(mensagens);
}
