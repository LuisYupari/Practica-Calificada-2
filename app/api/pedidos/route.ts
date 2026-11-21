import { NextResponse } from "next/server";
import { productos } from "../../../lib/data";
import { calcularTotal } from "../../../lib/cart";
import { validarCantidad, validarPedido } from "../../../lib/validation";
import type { ItemCarrito, TipoEntrega } from "../../../lib/types";

// Validación en el servidor: nunca se confía en precios enviados por el cliente.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ errores: ["JSON inválido"] }, { status: 400 });
  }

  const errores = validarPedido(body);
  if (errores.length > 0) return NextResponse.json({ errores }, { status: 400 });

  const items: ItemCarrito[] = [];
  for (const it of body.items as Array<{ productoId: string; cantidad: number }>) {
    const p = productos.find((x) => x.id === it.productoId);
    if (!p || !validarCantidad(it.cantidad, p.stock)) {
      return NextResponse.json({ errores: ["Producto o cantidad no disponible"] }, { status: 400 });
    }
    items.push({ productoId: p.id, nombre: p.nombre, precio: p.precio, cantidad: it.cantidad });
  }

  const total = calcularTotal(items, body.tipoEntrega as TipoEntrega);
  const id = `PED-${Date.now().toString().slice(-6)}`;
  return NextResponse.json({ id, total, estado: "pendiente" }, { status: 201 });
}
