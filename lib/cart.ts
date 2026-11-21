import type { ItemCarrito, TipoEntrega } from "./types";

export const COSTO_DELIVERY = 10;

export function calcularSubtotal(items: ItemCarrito[]): number {
  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  return Math.round(total * 100) / 100;
}

export function calcularTotal(items: ItemCarrito[], tipoEntrega: TipoEntrega): number {
  const subtotal = calcularSubtotal(items);
  if (subtotal === 0) return 0;
  return subtotal + (tipoEntrega === "delivery" ? COSTO_DELIVERY : 0);
}
