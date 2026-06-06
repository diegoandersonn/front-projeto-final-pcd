"use client";

import statusEnum from "../../enums/statusEnum";
import useGetPedidos from "../../hooks/useGetPedidos";
import useUpdatePedido from "../../hooks/useUpdatePedido";

export default function AdminHome() {
  const pedidos = useGetPedidos();
  const updatePedido = useUpdatePedido();

  function atualizarStatus(id: string, status: string) {
    updatePedido.mutate({ id, status });
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-orange-500">
            Painel Administrativo
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Gerenciar Pedidos
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Acompanhe todos os pedidos em tempo real e atualize o status de cada
            entrega.
          </p>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Todos os Pedidos
          </h2>

          {pedidos.isLoading && (
            <p className="text-slate-500">Carregando pedidos...</p>
          )}

          {pedidos.isError && (
            <p className="text-red-500">Erro ao carregar pedidos.</p>
          )}

          {!pedidos.isLoading && pedidos.data?.length === 0 && (
            <p className="text-slate-500">Nenhum pedido encontrado.</p>
          )}

          <div className="space-y-3">
            {pedidos.data?.map((pedido) => (
              <div
                key={pedido.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {pedido.cliente}
                    </p>

                    <p className="text-sm text-slate-600">{pedido.item}</p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      ID: {pedido.id}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 md:w-56">
                    <label className="text-sm font-medium text-slate-700">
                      Status
                    </label>

                    <select
                      value={pedido.status}
                      disabled={updatePedido.isPending}
                      onChange={(event) =>
                        atualizarStatus(pedido.id, event.target.value)
                      }
                      className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {Object.values(statusEnum).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
