import path from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import CreatePedidoType from "../types/createPedidoType";
import MensagemPedidoType from "../types/mensagemPedidoType";
import PagamentoType from "../types/pagamentoType";
import PedidoType from "../types/pedidoType";
import QueueMessageType from "../types/queueMessageType";

const PEDIDOS_GRPC_TARGET = process.env.PEDIDOS_GRPC_URL ?? process.env.BACKEND_GRPC_URL ?? "localhost:50051";
const PAGAMENTOS_GRPC_TARGET = process.env.PAGAMENTOS_GRPC_URL ?? process.env.BACKEND_GRPC_URL ?? "localhost:50052";
const PROTO_PATH = path.resolve(process.cwd(), "..", "proto", "pcd.proto");

type EmptyRequest = Record<string, never>;

type AtualizarPedidoRequest = {
  id: string;
  status: string;
};

type RpcQueueMessage = Omit<QueueMessageType<string>, "data"> & {
  data: string;
};

type CriarPedidoResponse = {
  mensagem: string;
  dados: MensagemPedidoType;
  fila: RpcQueueMessage;
};

type CriarPedidoBffResponse = Omit<CriarPedidoResponse, "fila"> & {
  fila: QueueMessageType;
};

type AtualizarPedidoResponse = {
  mensagem: string;
  dados: MensagemPedidoType;
};

type ListarPedidosResponse = {
  pedidos: PedidoType[];
};

type ListarPagamentosResponse = {
  pagamentos: PagamentoType[];
};

type ListarMensagensFilaResponse = {
  mensagens: RpcQueueMessage[];
};

type UnaryMethod<TRequest, TResponse> = (
  request: TRequest,
  callback: (error: grpc.ServiceError | null, response: TResponse) => void,
) => void;

type PedidosClient = grpc.Client & {
  ListarPedidos: UnaryMethod<EmptyRequest, ListarPedidosResponse>;
  CriarPedido: UnaryMethod<CreatePedidoType, CriarPedidoResponse>;
  AtualizarPedido: UnaryMethod<AtualizarPedidoRequest, AtualizarPedidoResponse>;
};

type PagamentosClient = grpc.Client & {
  ListarPagamentos: UnaryMethod<EmptyRequest, ListarPagamentosResponse>;
};

type FilaClient = grpc.Client & {
  ListarMensagensFila: UnaryMethod<EmptyRequest, ListarMensagensFilaResponse>;
};

type ServiceClientConstructor<TClient extends grpc.Client> = new (
  address: string,
  credentials: grpc.ChannelCredentials,
) => TClient;

type LoadedProto = {
  pcd: {
    PedidosService: ServiceClientConstructor<PedidosClient>;
    PagamentosService: ServiceClientConstructor<PagamentosClient>;
    FilaService: ServiceClientConstructor<FilaClient>;
  };
};

let loadedProto: LoadedProto | undefined;
let pedidosClient: PedidosClient | undefined;
let pagamentosClient: PagamentosClient | undefined;
let filaClient: FilaClient | undefined;

function loadProto(): LoadedProto {
  if (loadedProto) {
    return loadedProto;
  }

  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  loadedProto = grpc.loadPackageDefinition(packageDefinition) as unknown as LoadedProto;
  return loadedProto;
}

function unary<TRequest, TResponse>(
  method: UnaryMethod<TRequest, TResponse>,
  request: TRequest,
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    method(request, (error, response) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(response);
    });
  });
}

function getPedidosClient(): PedidosClient {
  if (!pedidosClient) {
    const proto = loadProto();
    pedidosClient = new proto.pcd.PedidosService(
      PEDIDOS_GRPC_TARGET,
      grpc.credentials.createInsecure(),
    );
  }

  return pedidosClient;
}

function getPagamentosClient(): PagamentosClient {
  if (!pagamentosClient) {
    const proto = loadProto();
    pagamentosClient = new proto.pcd.PagamentosService(
      PAGAMENTOS_GRPC_TARGET,
      grpc.credentials.createInsecure(),
    );
  }

  return pagamentosClient;
}

function getFilaClient(): FilaClient {
  if (!filaClient) {
    const proto = loadProto();
    filaClient = new proto.pcd.FilaService(
      PEDIDOS_GRPC_TARGET,
      grpc.credentials.createInsecure(),
    );
  }

  return filaClient;
}

function parseQueueMessage(message: RpcQueueMessage): QueueMessageType {
  return {
    ...message,
    data: JSON.parse(message.data),
  };
}

function normalizePagamento(pagamento: PagamentoType): PagamentoType {
  if (!pagamento.processadoEm) {
    const pagamentoSemProcessamento = { ...pagamento };
    delete pagamentoSemProcessamento.processadoEm;
    return pagamentoSemProcessamento;
  }

  return pagamento;
}

export async function listarPedidos(): Promise<PedidoType[]> {
  const response = await unary(getPedidosClient().ListarPedidos.bind(getPedidosClient()), {});
  return response.pedidos;
}

export async function criarPedido(input: CreatePedidoType): Promise<CriarPedidoBffResponse> {
  const response = await unary(getPedidosClient().CriarPedido.bind(getPedidosClient()), input);
  return {
    ...response,
    fila: parseQueueMessage(response.fila),
  };
}

export async function atualizarPedido(input: AtualizarPedidoRequest): Promise<AtualizarPedidoResponse> {
  return unary(getPedidosClient().AtualizarPedido.bind(getPedidosClient()), input);
}

export async function listarPagamentos(): Promise<PagamentoType[]> {
  const response = await unary(getPagamentosClient().ListarPagamentos.bind(getPagamentosClient()), {});
  return response.pagamentos.map(normalizePagamento);
}

export async function listarMensagensFila(): Promise<QueueMessageType[]> {
  const response = await unary(getFilaClient().ListarMensagensFila.bind(getFilaClient()), {});
  return response.mensagens.map(parseQueueMessage);
}
