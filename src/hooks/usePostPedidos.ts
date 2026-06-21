import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreatePedidoType from "../types/createPedidoType";

const usePostPedidos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePedidoType) => {
      const resposta = await fetch("/rpc/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return resposta.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};

export default usePostPedidos;
