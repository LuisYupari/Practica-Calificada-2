import type { Comerciante, Pedido, Producto } from "./types";

// Datos de demostración. En producción se leen de Supabase (ver supabase/schema.sql).
export const comerciantes: Comerciante[] = [
  { id: "c1", nombre: "Flores Doña Rosa", puesto: "Puesto 12", descripcion: "Rosas nacionales e importadas desde 1995." },
  { id: "c2", nombre: "Arreglos El Rímac", puesto: "Puesto 34", descripcion: "Arreglos para eventos, bodas y condolencias." }
];

export const productos: Producto[] = [
  { id: "p1", nombre: "Docena de rosas rojas", categoria: "rosas", precio: 35, stock: 20, comercianteId: "c1", emoji: "🌹" },
  { id: "p2", nombre: "Rosas blancas x12", categoria: "rosas", precio: 38, stock: 15, comercianteId: "c1", emoji: "🤍" },
  { id: "p3", nombre: "Arreglo de girasoles", categoria: "arreglos", precio: 60, stock: 8, comercianteId: "c2", emoji: "🌻" },
  { id: "p4", nombre: "Corona fúnebre", categoria: "arreglos", precio: 150, stock: 3, comercianteId: "c2", emoji: "💐" },
  { id: "p5", nombre: "Ave del paraíso", categoria: "tropicales", precio: 25, stock: 0, comercianteId: "c2", emoji: "🌺" },
  { id: "p6", nombre: "Orquídea en maceta", categoria: "plantas", precio: 80, stock: 5, comercianteId: "c1", emoji: "🪴" }
];

export const pedidosDemo: Pedido[] = [
  { id: "PED-001", cliente: "María López", telefono: "987654321", tipoEntrega: "retiro", items: [{ productoId: "p1", nombre: "Docena de rosas rojas", precio: 35, cantidad: 2 }], total: 70, estado: "pendiente" },
  { id: "PED-002", cliente: "Juan Pérez", telefono: "912345678", tipoEntrega: "delivery", direccion: "Av. Abancay 123", items: [{ productoId: "p3", nombre: "Arreglo de girasoles", precio: 60, cantidad: 1 }], total: 70, estado: "confirmado" },
  { id: "PED-003", cliente: "Ana Torres", telefono: "998877665", tipoEntrega: "retiro", items: [{ productoId: "p6", nombre: "Orquídea en maceta", precio: 80, cantidad: 1 }], total: 80, estado: "entregado" }
];
