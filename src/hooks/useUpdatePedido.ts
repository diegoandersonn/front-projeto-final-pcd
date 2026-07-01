import { useMutation, useQueryClient } from "@tanstack/react-query";
import StatusEnum from "../enums/statusEnum";
import { parseJsonResponse } from "../utils/http";

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

      return parseJsonResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
}

export default useUpdatePedido;
