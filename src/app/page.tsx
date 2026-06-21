"use client";

import { useState } from "react";
import useGetPagamentos from "../hooks/useGetPagamentos";
import useGetPedidos from "../hooks/useGetPedidos";
import usePostPedidos from "../hooks/usePostPedidos";
import CreatePedidoType from "../types/createPedidoType";
import PagamentoType from "../types/pagamentoType";
import PedidoType from "../types/pedidoType";

function statusPedidoClass(status: string) {
  if (status.includes("Concluído")) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status.includes("Cancelado")) {
    return "bg-red-100 text-red-700";
  }

  if (status.includes("Saiu")) {
    return "bg-purple-100 text-purple-700";
  }

  if (status.includes("Andamento")) {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function statusPagamentoClass(status: PagamentoType["status"]) {
  if (status === "Aprovado") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Recusado") {
    return "bg-red-100 text-red-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [item, setItem] = useState("");

  const pedidos = useGetPedidos();
  const pagamentos = useGetPagamentos();
  const criarPedido = usePostPedidos();

  function enviarPedido(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cliente || !item) {
      alert("Preencha o nome do cliente e o pedido.");
      return;
    }

    const novoPedido: CreatePedidoType = {
      cliente,
      item,
    };

    criarPedido.mutate(novoPedido, {
      onSuccess: () => {
        setCliente("");
        setItem("");
      },
    });
  }

  const pedidosOrdenados = [...(pedidos.data ?? [])].reverse();
  const pagamentosOrdenados = pagamentos.data ?? [];

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-orange-950/20 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
            Delivery online
          </p>

          <div className="mt-4 grid gap-6 md:grid-cols-[1.3fr_0.7fr] md:items-end">
            <div>
              <h1 className="text-4xl font-black text-white md:text-6xl">
                Faça seu pedido
              </h1>

              <p className="mt-4 max-w-3xl text-slate-300">
                Monte seu pedido, acompanhe o pagamento e veja o status mudar
                conforme a equipe prepara a entrega.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-2xl font-black text-white">
                  {pagamentosOrdenados.length}
                </p>
                <p className="text-xs text-slate-400">pagamentos</p>
              </div>
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-2xl font-black text-white">
                  {pedidos.data?.length ?? 0}
                </p>
                <p className="text-xs text-slate-400">pedidos</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          <section className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-xl">
            <h2 className="text-2xl font-black">Novo pedido</h2>
            <p className="mt-2 text-sm text-slate-500">
              Informe seus dados e aguarde a confirmação do pagamento.
            </p>

            <form onSubmit={enviarPedido} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  Nome do cliente
                </label>
                <input
                  type="text"
                  value={cliente}
                  onChange={(event) => setCliente(event.target.value)}
                  placeholder="Ex: Diego"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  Pedido
                </label>
                <input
                  type="text"
                  value={item}
                  onChange={(event) => setItem(event.target.value)}
                  placeholder="Ex: Pizza de calabresa"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={criarPedido.isPending}
                className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {criarPedido.isPending ? "Enviando pedido..." : "Enviar pedido"}
              </button>
            </form>

            {criarPedido.isError && (
              <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                Não foi possível criar o pedido.
              </p>
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl">
            <h2 className="text-2xl font-black">Pagamentos</h2>
            <p className="mt-2 text-sm text-slate-500">
              Se o pagamento for aprovado, o pedido fica pendente para o admin.
              Se for recusado, o pedido é cancelado automaticamente.
            </p>

            <div className="mt-6 space-y-3">
              {pagamentosOrdenados.length === 0 && !pagamentos.isLoading && (
                <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  Nenhum pagamento processado ainda.
                </p>
              )}

              {pagamentosOrdenados.map((pagamento) => (
                <div key={pagamento.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{pagamento.cliente}</p>
                      <p className="text-sm text-slate-600">{pagamento.item}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${statusPagamentoClass(
                        pagamento.status,
                      )}`}
                    >
                      {pagamento.status}
                    </span>
                  </div>

                  <p className="mt-3 truncate font-mono text-xs text-slate-400">
                    pedido: {pagamento.pedidoId}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl">
            <h2 className="text-2xl font-black">Pedidos</h2>
            <p className="mt-2 text-sm text-slate-500">
              Acompanhe o preparo, a saída para entrega e a conclusão do seu pedido.
            </p>

            {pedidos.isError && (
              <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                Erro ao carregar pedidos.
              </p>
            )}

            <div className="mt-6 space-y-3">
              {pedidosOrdenados.length === 0 && !pedidos.isLoading && (
                <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  Nenhum pedido criado ainda.
                </p>
              )}

              {pedidosOrdenados.map((pedido: PedidoType) => (
                <div key={pedido.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{pedido.cliente}</p>
                      <p className="text-sm text-slate-600">{pedido.item}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${statusPedidoClass(
                        pedido.status,
                      )}`}
                    >
                      {pedido.status}
                    </span>
                  </div>

                  <p className="mt-3 truncate font-mono text-xs text-slate-400">
                    {pedido.id}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
