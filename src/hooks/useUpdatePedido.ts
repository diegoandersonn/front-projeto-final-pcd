import { useMutation, useQueryClient } from "@tanstack/react-query";
import StatusEnum from "../enums/statusEnum";

type UpdatePedidoInput = {
  id: string;
  status: StatusEnum;
};

const useUpdatePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pedido: UpdatePedidoInput) => {
      const response = await fetch(`/rpc/pedidos/${pedido.id}`, {
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
