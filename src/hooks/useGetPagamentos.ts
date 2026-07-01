import { useQuery } from "@tanstack/react-query";
import PagamentoType from "../types/pagamentoType";
import { parseJsonResponse } from "../utils/http";

const useGetPagamentos = () => {
  return useQuery<PagamentoType[]>({
    queryKey: ["pagamentos"],
    queryFn: async () => {
      const resposta = await fetch("/rpc/pagamentos");
      return parseJsonResponse<PagamentoType[]>(resposta);
    },
  });
};

export default useGetPagamentos;
