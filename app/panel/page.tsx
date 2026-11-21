"use client";

import { useState } from "react";
import { pedidosDemo } from "../../lib/data";
import { TRANSICIONES, cambiarEstado } from "../../lib/orders";
import type { EstadoPedido, Pedido } from "../../lib/types";

export default function Panel() {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosDemo);

  function actualizar(id: string, nuevo: EstadoPedido) {
    setPedidos(pedidos.map((p) => (p.id === id ? { ...p, estado: cambiarEstado(p.estado, nuevo) } : p)));
  }

  const ventas = pedidos.filter((p) => p.estado === "entregado").reduce((a, p) => a + p.total, 0);
  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Panel de pedidos</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-gray-500">Pedidos totales</p><p className="text-2xl font-bold">{pedidos.length}</p></div>
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-gray-500">Pendientes</p><p className="text-2xl font-bold">{pendientes}</p></div>
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-gray-500">Ventas entregadas</p><p className="text-2xl font-bold">S/ {ventas}</p></div>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-rose-100"><tr><th className="p-2">Pedido</th><th className="p-2">Cliente</th><th className="p-2">Entrega</th><th className="p-2">Total</th><th className="p-2">Estado</th><th className="p-2">Acciones</th></tr></thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.cliente}</td>
                <td className="p-2 capitalize">{p.tipoEntrega}</td>
                <td className="p-2">S/ {p.total}</td>
                <td className="p-2 capitalize">{p.estado}</td>
                <td className="flex gap-1 p-2">
                  {TRANSICIONES[p.estado].map((e) => (
                    <button key={e} onClick={() => actualizar(p.id, e)} className="rounded bg-rose-600 px-2 py-1 text-xs text-white capitalize">{e}</button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
