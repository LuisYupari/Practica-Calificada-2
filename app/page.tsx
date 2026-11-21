"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { productos, comerciantes } from "../lib/data";
import { calcularSubtotal, calcularTotal } from "../lib/cart";
import { validarCantidad } from "../lib/validation";
import type { ItemCarrito, TipoEntrega } from "../lib/types";

export default function Catalogo() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>("retiro");
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const filtrados = useMemo(
    () =>
      productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
          (categoria === "todas" || p.categoria === categoria)
      ),
    [busqueda, categoria]
  );

  function agregar(id: string) {
    const p = productos.find((x) => x.id === id);
    if (!p) return;
    const actual = carrito.find((i) => i.productoId === id);
    const nuevaCantidad = (actual?.cantidad ?? 0) + 1;
    if (!validarCantidad(nuevaCantidad, p.stock)) {
      setMensaje(`No hay stock suficiente de ${p.nombre}`);
      return;
    }
    setMensaje("");
    setCarrito(
      actual
        ? carrito.map((i) => (i.productoId === id ? { ...i, cantidad: nuevaCantidad } : i))
        : [...carrito, { productoId: id, nombre: p.nombre, precio: p.precio, cantidad: 1 }]
    );
  }

  async function confirmar() {
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente, telefono, tipoEntrega, direccion, items: carrito })
    });
    const data = await res.json();
    if (res.ok) {
      setMensaje(`✅ Pedido ${data.id} registrado. Total: S/ ${data.total}`);
      setCarrito([]);
    } else {
      setMensaje(`❌ ${data.errores.join(". ")}`);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section className="md:col-span-2">
        <h1 className="mb-4 text-2xl font-bold">Catálogo de flores</h1>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input className="flex-1 rounded border p-2" placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <select className="rounded border p-2" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="todas">Todas las categorías</option>
            <option value="rosas">Rosas</option>
            <option value="arreglos">Arreglos</option>
            <option value="tropicales">Tropicales</option>
            <option value="plantas">Plantas</option>
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((p) => {
            const c = comerciantes.find((x) => x.id === p.comercianteId);
            return (
              <div key={p.id} className="rounded-lg bg-white p-4 shadow">
                <div className="text-5xl">{p.emoji}</div>
                <h2 className="mt-2 font-semibold">{p.nombre}</h2>
                <p className="text-sm text-gray-500 capitalize">{p.categoria}</p>
                <Link href={`/comerciante/${p.comercianteId}`} className="text-sm text-rose-700 underline">{c?.nombre}</Link>
                <p className="mt-1 text-lg font-bold">S/ {p.precio}</p>
                <p className={`text-sm ${p.stock > 0 ? "text-green-700" : "text-red-600"}`}>
                  {p.stock > 0 ? `Disponible (${p.stock})` : "Agotado"}
                </p>
                <button disabled={p.stock === 0} onClick={() => agregar(p.id)} className="mt-2 w-full rounded bg-rose-600 p-2 text-white disabled:bg-gray-300">
                  Agregar al carrito
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="h-fit rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 text-xl font-bold">🛒 Carrito</h2>
        {carrito.length === 0 && <p className="text-sm text-gray-500">Vacío</p>}
        {carrito.map((i) => (
          <div key={i.productoId} className="flex justify-between text-sm">
            <span>{i.cantidad} × {i.nombre}</span>
            <span>S/ {i.precio * i.cantidad}</span>
          </div>
        ))}
        <p className="mt-2 text-sm">Subtotal: S/ {calcularSubtotal(carrito)}</p>
        <div className="mt-3 flex gap-4 text-sm">
          <label><input type="radio" checked={tipoEntrega === "retiro"} onChange={() => setTipoEntrega("retiro")} /> Retiro en mercado</label>
          <label><input type="radio" checked={tipoEntrega === "delivery"} onChange={() => setTipoEntrega("delivery")} /> Delivery (+S/ 10)</label>
        </div>
        <input className="mt-2 w-full rounded border p-2 text-sm" placeholder="Tu nombre" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        <input className="mt-2 w-full rounded border p-2 text-sm" placeholder="Teléfono (9XXXXXXXX)" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        {tipoEntrega === "delivery" && (
          <input className="mt-2 w-full rounded border p-2 text-sm" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        )}
        <p className="mt-3 font-bold">Total: S/ {calcularTotal(carrito, tipoEntrega)}</p>
        <button onClick={confirmar} className="mt-2 w-full rounded bg-green-700 p-2 text-white">Confirmar pedido</button>
        {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
      </aside>
    </div>
  );
}
