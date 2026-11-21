export type Categoria = "rosas" | "arreglos" | "tropicales" | "plantas";
export type EstadoPedido = "pendiente" | "confirmado" | "listo" | "entregado" | "cancelado";
export type TipoEntrega = "retiro" | "delivery";

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  stock: number;
  comercianteId: string;
  emoji: string;
}

export interface Comerciante {
  id: string;
  nombre: string;
  puesto: string;
  descripcion: string;
}

export interface ItemCarrito {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  id: string;
  cliente: string;
  telefono: string;
  tipoEntrega: TipoEntrega;
  direccion?: string;
  items: ItemCarrito[];
  total: number;
  estado: EstadoPedido;
}
