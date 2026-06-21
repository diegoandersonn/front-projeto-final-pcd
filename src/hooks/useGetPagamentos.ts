import { useQuery } from "@tanstack/react-query";
import PagamentoType from "../types/pagamentoType";

const useGetPagamentos = () => {
  return useQuery<PagamentoType[]>({
    queryKey: ["pagamentos"],
    queryFn: async () => {
      const resposta = await fetch("/rpc/pagamentos");
      return resposta.json();
    },
  });
};

export default useGetPagamentos;
