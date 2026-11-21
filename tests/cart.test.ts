import { describe, it, expect } from "vitest";
import { calcularSubtotal, calcularTotal } from "../lib/cart";

const items = [
  { productoId: "p1", nombre: "Rosas", precio: 35, cantidad: 2 },
  { productoId: "p3", nombre: "Girasoles", precio: 60, cantidad: 1 }
];

describe("Carrito", () => {
  it("calcula el subtotal correctamente", () => {
    expect(calcularSubtotal(items)).toBe(130);
  });
  it("subtotal de carrito vacío es 0", () => {
    expect(calcularSubtotal([])).toBe(0);
  });
  it("suma costo de delivery", () => {
    expect(calcularTotal(items, "delivery")).toBe(140);
  });
  it("retiro en mercado no suma delivery", () => {
    expect(calcularTotal(items, "retiro")).toBe(130);
  });
  it("carrito vacío no cobra delivery", () => {
    expect(calcularTotal([], "delivery")).toBe(0);
  });
});
