import { useQuery } from "@tanstack/react-query";
import PedidoType from "../types/pedidoType";
import { parseJsonResponse } from "../utils/http";

const useGetPedidos = () => {
  return useQuery<PedidoType[]>({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const resposta = await fetch("/rpc/pedidos");
      return parseJsonResponse<PedidoType[]>(resposta);
    },
  });
};

export default useGetPedidos;
