import { NextResponse } from "next/server";
import { atualizarPedido } from "../../../../server/grpcClient";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as { status: string };

  try {
    const response = await atualizarPedido({ id, status: body.status });
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao alterar o pedido.";
    return NextResponse.json({ mensagem: message }, { status: 404 });
  }
}
