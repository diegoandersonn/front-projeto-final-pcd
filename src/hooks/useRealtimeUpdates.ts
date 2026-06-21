import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import MensagemPedidoType from "../types/mensagemPedidoType";
import PagamentoType from "../types/pagamentoType";
import PedidoType from "../types/pedidoType";

const PEDIDOS_SOCKET_URL = process.env.NEXT_PUBLIC_PEDIDOS_SOCKET_URL ?? "http://localhost:3001";
const PAGAMENTOS_SOCKET_URL = process.env.NEXT_PUBLIC_PAGAMENTOS_SOCKET_URL ?? "http://localhost:3002";

function upsertById<T extends { id: string }>(items: T[] | undefined, item: T): T[] {
  const currentItems = items ?? [];
  const itemExists = currentItems.some((currentItem) => currentItem.id === item.id);

  if (!itemExists) {
    return [item, ...currentItems];
  }

  return currentItems.map((currentItem) =>
    currentItem.id === item.id ? item : currentItem,
  );
}

export default function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const pedidosSocket = io(PEDIDOS_SOCKET_URL);
    const pagamentosSocket = io(PAGAMENTOS_SOCKET_URL);

    pedidosSocket.on("pedido:criado", (message: MensagemPedidoType) => {
      queryClient.setQueryData<PedidoType[]>(["pedidos"], (pedidos) =>
        upsertById(pedidos, message.pedido),
      );
    });

    pedidosSocket.on("pedido:atualizado", (message: MensagemPedidoType) => {
      queryClient.setQueryData<PedidoType[]>(["pedidos"], (pedidos) =>
        upsertById(pedidos, message.pedido),
      );
    });

    pagamentosSocket.on("pagamento:processando", (pagamento: PagamentoType) => {
      queryClient.setQueryData<PagamentoType[]>(["pagamentos"], (pagamentos) =>
        upsertById(pagamentos, pagamento),
      );
    });

    pagamentosSocket.on("pagamento:aprovado", (pagamento: PagamentoType) => {
      queryClient.setQueryData<PagamentoType[]>(["pagamentos"], (pagamentos) =>
        upsertById(pagamentos, pagamento),
      );
    });

    pagamentosSocket.on("pagamento:recusado", (pagamento: PagamentoType) => {
      queryClient.setQueryData<PagamentoType[]>(["pagamentos"], (pagamentos) =>
        upsertById(pagamentos, pagamento),
      );
    });

    return () => {
      pedidosSocket.disconnect();
      pagamentosSocket.disconnect();
    };
  }, [queryClient]);
}
