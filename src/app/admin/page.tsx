"use client";

import statusEnum from "../../enums/statusEnum";
import useGetPagamentos from "../../hooks/useGetPagamentos";
import useGetPedidos from "../../hooks/useGetPedidos";
import useUpdatePedido from "../../hooks/useUpdatePedido";
import PagamentoType from "../../types/pagamentoType";
import PedidoType from "../../types/pedidoType";

function statusPedidoClass(status: string) {
  if (status.includes("Concluído")) {
    return "bg-emerald-100 text-emerald-700 ring-emerald-200";
  }

  if (status.includes("Cancelado")) {
    return "bg-red-100 text-red-700 ring-red-200";
  }

  if (status.includes("Saiu")) {
    return "bg-purple-100 text-purple-700 ring-purple-200";
  }

  if (status.includes("Andamento")) {
    return "bg-blue-100 text-blue-700 ring-blue-200";
  }

  return "bg-amber-100 text-amber-700 ring-amber-200";
}

function statusPagamentoClass(status: PagamentoType["status"]) {
  if (status === "Aprovado") {
    return "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30";
  }

  if (status === "Recusado") {
    return "bg-red-500/15 text-red-200 ring-red-400/30";
  }

  return "bg-blue-500/15 text-blue-200 ring-blue-400/30";
}

function proximaAcaoLabel(status: statusEnum) {
  if (status === statusEnum.PENDENTE) {
    return "Aguardando aceite do admin";
  }

  if (status === statusEnum.EM_ANDAMENTO) {
    return "Preparando pedido";
  }

  if (status === statusEnum.SAIU_PARA_ENTREGA) {
    return "Pedido saiu para entrega";
  }

  if (status === statusEnum.CONCLUIDO) {
    return "Fluxo concluído";
  }

  return "Fluxo encerrado";
}

export default function AdminHome() {
  const pedidos = useGetPedidos();
  const pagamentos = useGetPagamentos();
  const updatePedido = useUpdatePedido();

  function atualizarStatus(id: string, status: statusEnum) {
    updatePedido.mutate({ id, status });
  }

  function renderAcoes(pedido: PedidoType) {
    if (pedido.status === statusEnum.PENDENTE) {
      return (
        <div className="grid gap-2 sm:grid-cols-2 lg:w-72">
          <button
            type="button"
            disabled={updatePedido.isPending}
            onClick={() => atualizarStatus(pedido.id, statusEnum.EM_ANDAMENTO)}
            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Aceitar pedido
          </button>

          <button
            type="button"
            disabled={updatePedido.isPending}
            onClick={() => atualizarStatus(pedido.id, statusEnum.CANCELADO)}
            className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      );
    }

    if (pedido.status === statusEnum.EM_ANDAMENTO) {
      return (
        <div className="grid gap-2 sm:grid-cols-2 lg:w-72">
          <button
            type="button"
            disabled={updatePedido.isPending}
            onClick={() => atualizarStatus(pedido.id, statusEnum.SAIU_PARA_ENTREGA)}
            className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Saiu para entrega
          </button>

          <button
            type="button"
            disabled={updatePedido.isPending}
            onClick={() => atualizarStatus(pedido.id, statusEnum.CANCELADO)}
            className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      );
    }

    if (pedido.status === statusEnum.SAIU_PARA_ENTREGA) {
      return (
        <button
          type="button"
          disabled={updatePedido.isPending}
          onClick={() => atualizarStatus(pedido.id, statusEnum.CONCLUIDO)}
          className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 lg:w-72"
        >
          Concluir pedido
        </button>
      );
    }

    return (
      <div className="rounded-2xl bg-slate-200 px-4 py-3 text-center text-sm font-black text-slate-500 lg:w-72">
        Sem ações disponíveis
      </div>
    );
  }

  const pedidosOrdenados = [...(pedidos.data ?? [])].reverse();
  const pagamentosRecentes = pagamentos.data ?? [];
  const pedidosPendentes = pedidosOrdenados.filter(
    (pedido) => pedido.status === statusEnum.PENDENTE,
  ).length;
  const pedidosEmAndamento = pedidosOrdenados.filter(
    (pedido) => pedido.status === statusEnum.EM_ANDAMENTO,
  ).length;
  const pagamentosAprovados = pagamentosRecentes.filter(
    (pagamento) => pagamento.status === "Aprovado",
  ).length;
  const pagamentosRecusados = pagamentosRecentes.filter(
    (pagamento) => pagamento.status === "Recusado",
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <section className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,#1f3b73,transparent_38%),linear-gradient(135deg,#111827,#020617)] p-6 shadow-2xl shadow-black/30 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Painel administrativo
              </p>

              <h1 className="mt-4 text-4xl font-black text-white md:text-6xl">
                Aceite e operação dos pedidos
              </h1>

              <p className="mt-4 max-w-3xl text-slate-300">
                Acompanhe os pedidos pagos, aceite o preparo, cancele quando
                necessário e avance cada entrega até a conclusão.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-100">
              Gestão de pedidos em tempo real
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-xl">
            <p className="text-sm font-bold text-slate-500">Pedidos</p>
            <p className="mt-2 text-4xl font-black">{pedidos.data?.length ?? 0}</p>
          </div>

          <div className="rounded-3xl bg-amber-500 p-5 text-white shadow-xl shadow-amber-950/30">
            <p className="text-sm font-bold text-amber-100">Aguardando aceite</p>
            <p className="mt-2 text-4xl font-black">{pedidosPendentes}</p>
          </div>

          <div className="rounded-3xl bg-blue-500 p-5 text-white shadow-xl shadow-blue-950/30">
            <p className="text-sm font-bold text-blue-100">Em andamento</p>
            <p className="mt-2 text-4xl font-black">{pedidosEmAndamento}</p>
          </div>

          <div className="rounded-3xl bg-emerald-500 p-5 text-white shadow-xl shadow-emerald-950/30">
            <p className="text-sm font-bold text-emerald-100">Pagamentos aprovados</p>
            <p className="mt-2 text-4xl font-black">{pagamentosAprovados}</p>
          </div>

          <div className="rounded-3xl bg-red-500 p-5 text-white shadow-xl shadow-red-950/30">
            <p className="text-sm font-bold text-red-100">Pagamentos recusados</p>
            <p className="mt-2 text-4xl font-black">{pagamentosRecusados}</p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-black">Pedidos</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Aceite pedidos pagos, cancele pedidos não aceitos e avance o
                  fluxo para andamento, saída para entrega e conclusão.
                </p>
              </div>

              {updatePedido.isPending && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                  Salvando alteração...
                </span>
              )}
            </div>

            {pedidos.isLoading && (
              <p className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                Carregando pedidos...
              </p>
            )}

            {pedidos.isError && (
              <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                Erro ao carregar pedidos.
              </p>
            )}

            {!pedidos.isLoading && pedidosOrdenados.length === 0 && (
              <p className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                Nenhum pedido encontrado.
              </p>
            )}

            <div className="mt-6 grid gap-4">
              {pedidosOrdenados.map((pedido) => (
                <article
                  key={pedido.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-black text-slate-900">
                          {pedido.cliente}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusPedidoClass(
                            pedido.status,
                          )}`}
                        >
                          {pedido.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {pedido.item}
                      </p>

                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        {proximaAcaoLabel(pedido.status)}
                      </p>

                      <p className="mt-3 truncate font-mono text-xs text-slate-400">
                        ID: {pedido.id}
                      </p>
                    </div>

                    {renderAcoes(pedido)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside>
            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl">
              <h2 className="text-2xl font-black text-white">Pagamentos</h2>
              <p className="mt-2 text-sm text-slate-400">
                Se aprovado, o pedido fica pendente para aceite. Se recusado, o
                pedido é cancelado automaticamente.
              </p>

              <div className="mt-6 max-h-[26rem] space-y-3 overflow-y-auto pr-2">
                {pagamentosRecentes.length === 0 && !pagamentos.isLoading && (
                  <p className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                    Nenhum pagamento processado ainda.
                  </p>
                )}

                {pagamentosRecentes.map((pagamento) => (
                  <div key={pagamento.id} className="rounded-2xl bg-slate-800 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-white">{pagamento.cliente}</p>
                        <p className="truncate text-sm text-slate-400">{pagamento.item}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusPagamentoClass(
                          pagamento.status,
                        )}`}
                      >
                        {pagamento.status}
                      </span>
                    </div>

                    <p className="mt-3 truncate font-mono text-xs text-slate-500">
                      pedido: {pagamento.pedidoId}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
