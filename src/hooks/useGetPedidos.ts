import { useQuery } from "@tanstack/react-query";
import PedidoType from "../types/pedidoType";

const useGetPedidos = () => {
  return useQuery<PedidoType[]>({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const resposta = await fetch("http://localhost:3001/api/pedidos");
      return resposta.json();
    },
  });
};

export default useGetPedidos;