import { describe, it, expect } from "vitest";
import { cambiarEstado, puedeTransicionar } from "../lib/orders";

describe("Transiciones de estado de pedidos", () => {
  it("pendiente -> confirmado está permitido", () => expect(puedeTransicionar("pendiente", "confirmado")).toBe(true));
  it("confirmado -> listo -> entregado", () => {
    expect(cambiarEstado(cambiarEstado("confirmado", "listo"), "entregado")).toBe("entregado");
  });
  it("no se puede saltar de pendiente a entregado", () => {
    expect(() => cambiarEstado("pendiente", "entregado")).toThrow("Transición no permitida");
  });
  it("un pedido entregado no puede cancelarse", () => expect(puedeTransicionar("entregado", "cancelado")).toBe(false));
  it("un pedido cancelado es final", () => expect(puedeTransicionar("cancelado", "pendiente")).toBe(false));
});
