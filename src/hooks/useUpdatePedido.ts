import { useMutation, useQueryClient } from "@tanstack/react-query";
import PedidoType from "../types/pedidoType";

const useUpdatePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pedido: PedidoType) => {
      const response = await fetch(`http://localhost:3001/api/pedidos/${pedido.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        throw new Error("Erro ao alterar o pedido.");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
}

export default useUpdatePedido;