import { useQuery } from "@tanstack/react-query";
import PedidoType from "../types/pedidoType";

const useGetPedidos = () => {
  return useQuery<PedidoType[]>({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const resposta = await fetch("/rpc/pedidos");
      return resposta.json();
    },
  });
};

export default useGetPedidos;
