import { NextResponse } from "next/server";
import { criarPedido, listarPedidos } from "../../../server/grpcClient";
import CreatePedidoType from "../../../types/createPedidoType";

export async function GET() {
  const pedidos = await listarPedidos();
  return NextResponse.json(pedidos);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreatePedidoType;
  const response = await criarPedido(body);

  return NextResponse.json(response, { status: 202 });
}
