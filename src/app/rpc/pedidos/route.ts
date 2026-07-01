import { NextResponse } from "next/server";
import { criarPedido, listarPedidos } from "../../../server/grpcClient";
import CreatePedidoType from "../../../types/createPedidoType";

export async function GET() {
  try {
    const pedidos = await listarPedidos();
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Erro ao listar pedidos", error);
    return NextResponse.json({ error: "Erro ao listar pedidos." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePedidoType;
    const response = await criarPedido(body);

    return NextResponse.json(response, { status: 202 });
  } catch (error) {
    console.error("Erro ao criar pedido", error);
    return NextResponse.json({ error: "Erro ao criar pedido." }, { status: 500 });
  }
}
