import type { Producto, TipoEntrega } from "./types";

const CATEGORIAS = ["rosas", "arreglos", "tropicales", "plantas"];

export function validarProducto(p: Partial<Producto>): string[] {
  const errores: string[] = [];
  if (!p.nombre || p.nombre.trim().length < 3) errores.push("El nombre debe tener al menos 3 caracteres");
  if (!p.categoria || !CATEGORIAS.includes(p.categoria)) errores.push("Categoría inválida");
  if (typeof p.precio !== "number" || !(p.precio > 0)) errores.push("El precio debe ser mayor a 0");
  if (typeof p.stock !== "number" || !Number.isInteger(p.stock) || p.stock < 0) errores.push("El stock debe ser un entero mayor o igual a 0");
  return errores;
}

export function validarCantidad(cantidad: number, stock: number): boolean {
  return Number.isInteger(cantidad) && cantidad > 0 && cantidad <= stock && cantidad <= 100;
}

export interface DatosPedido {
  cliente?: unknown;
  telefono?: unknown;
  tipoEntrega?: unknown;
  direccion?: unknown;
  items?: unknown;
}

export function validarPedido(d: DatosPedido): string[] {
  const errores: string[] = [];
  if (typeof d.cliente !== "string" || d.cliente.trim().length < 2) errores.push("Nombre del cliente requerido");
  if (typeof d.telefono !== "string" || !/^9\d{8}$/.test(d.telefono)) errores.push("Teléfono inválido (9 dígitos, empieza con 9)");
  const tipo = d.tipoEntrega as TipoEntrega;
  if (tipo !== "retiro" && tipo !== "delivery") errores.push("Tipo de entrega inválido");
  if (tipo === "delivery" && (typeof d.direccion !== "string" || d.direccion.trim().length < 5)) errores.push("Dirección requerida para delivery");
  if (!Array.isArray(d.items) || d.items.length === 0) {
    errores.push("El pedido debe tener al menos un producto");
  } else {
    for (const it of d.items as Array<Record<string, unknown>>) {
      if (typeof it.productoId !== "string") errores.push("Producto inválido");
      if (typeof it.cantidad !== "number" || !Number.isInteger(it.cantidad) || it.cantidad <= 0) errores.push("Cantidad inválida");
    }
  }
  return errores;
}
