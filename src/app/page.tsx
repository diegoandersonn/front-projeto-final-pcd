"use client";

import { useState } from "react";
import useGetPedidos from "../hooks/useGetPedidos";
import usePostPedidos from "../hooks/usePostPedidos";
import CreatePedidoType from "../types/createPedidoType";

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [item, setItem] = useState("");

  const pedidos = useGetPedidos();
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
      }
    });
  }

  console.log(pedidos.data);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-orange-500">
            Sistema Distribuído
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Delivery em Tempo Real
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Sistema web para simular o envio, processamento e acompanhamento de
            pedidos utilizando REST, Socket.IO, gRPC e controle de concorrência.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Novo Pedido
            </h2>

            <form onSubmit={enviarPedido} className="space-y-4 text-slate-700">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nome do cliente
                </label>
                <input
                  type="text"
                  value={cliente}
                  onChange={(event) => setCliente(event.target.value)}
                  placeholder="Ex: Diego"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Pedido
                </label>
                <input
                  type="text"
                  value={item}
                  onChange={(event) => setItem(event.target.value)}
                  placeholder="Ex: Pizza de calabresa"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={criarPedido.isPending}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {criarPedido.isPending ? "Enviando..." : "Enviar Pedido"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Pedidos em Tempo Real
            </h2>

            {pedidos.isLoading && (
              <p className="text-slate-500">Carregando pedidos...</p>
            )}

            {pedidos.isError && (
              <p className="text-red-500">Erro ao carregar pedidos.</p>
            )}

            <div className="space-y-3">
              {pedidos.data?.map((pedido) => (
                <div
                  key={pedido.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">
                      {pedido.cliente}
                    </p>

                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      {pedido.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">{pedido.item}</p>

                  <p className="text-xs font-bold text-slate-600">
                    {pedido.id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
