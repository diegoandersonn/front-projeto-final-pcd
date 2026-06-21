type QueueMessageType<T = unknown> = {
  id: string;
  event:
    | "pedido.criado"
    | "pagamento.processando"
    | "pagamento.aprovado"
    | "pagamento.recusado"
    | "pedido.atualizado";
  data: T;
  createdAt: string;
};

export default QueueMessageType;
