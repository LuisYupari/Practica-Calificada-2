import { describe, it, expect } from "vitest";
import { validarCantidad, validarPedido, validarProducto } from "../lib/validation";

describe("Validación de productos", () => {
  it("acepta un producto válido", () => {
    expect(validarProducto({ nombre: "Rosas rojas", categoria: "rosas", precio: 35, stock: 10 })).toEqual([]);
  });
  it("rechaza precio negativo y nombre corto", () => {
    const errores = validarProducto({ nombre: "Ro", categoria: "rosas", precio: -5, stock: 10 });
    expect(errores).toContain("El precio debe ser mayor a 0");
    expect(errores).toContain("El nombre debe tener al menos 3 caracteres");
  });
  it("rechaza categoría inexistente", () => {
    expect(validarProducto({ nombre: "Cactus", categoria: "otra" as never, precio: 5, stock: 1 })).toContain("Categoría inválida");
  });
});

describe("Validación de cantidades", () => {
  it("acepta cantidad dentro del stock", () => expect(validarCantidad(3, 10)).toBe(true));
  it("rechaza cero o negativos", () => {
    expect(validarCantidad(0, 10)).toBe(false);
    expect(validarCantidad(-1, 10)).toBe(false);
  });
  it("rechaza cantidad mayor al stock", () => expect(validarCantidad(11, 10)).toBe(false));
  it("rechaza decimales", () => expect(validarCantidad(1.5, 10)).toBe(false));
});

describe("Validación de pedidos", () => {
  const base = { cliente: "María", telefono: "987654321", tipoEntrega: "retiro", items: [{ productoId: "p1", cantidad: 1 }] };
  it("acepta un pedido válido", () => expect(validarPedido(base)).toEqual([]));
  it("rechaza teléfono inválido", () => expect(validarPedido({ ...base, telefono: "123" }).length).toBeGreaterThan(0));
  it("exige dirección para delivery", () => {
    expect(validarPedido({ ...base, tipoEntrega: "delivery" })).toContain("Dirección requerida para delivery");
  });
  it("rechaza pedido sin productos", () => {
    expect(validarPedido({ ...base, items: [] })).toContain("El pedido debe tener al menos un producto");
  });
});
