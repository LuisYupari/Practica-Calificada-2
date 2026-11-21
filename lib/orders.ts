import type { EstadoPedido } from "./types";

export const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  pendiente: ["confirmado", "cancelado"],
  confirmado: ["listo", "cancelado"],
  listo: ["entregado"],
  entregado: [],
  cancelado: []
};

export function puedeTransicionar(actual: EstadoPedido, nuevo: EstadoPedido): boolean {
  return TRANSICIONES[actual].includes(nuevo);
}

export function cambiarEstado(actual: EstadoPedido, nuevo: EstadoPedido): EstadoPedido {
  if (!puedeTransicionar(actual, nuevo)) {
    throw new Error(`Transición no permitida: ${actual} -> ${nuevo}`);
  }
  return nuevo;
}
