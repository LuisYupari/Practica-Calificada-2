-- MercadoAcho: esquema de base de datos con Row Level Security (RLS)
-- Ejecutar en Supabase > SQL Editor

create table public.comerciantes (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null check (char_length(nombre) >= 3),
  puesto text,
  descripcion text,
  created_at timestamptz default now()
);

create table public.productos (
  id uuid primary key default gen_random_uuid(),
  comerciante_id uuid not null references public.comerciantes(id) on delete cascade,
  nombre text not null check (char_length(nombre) >= 3),
  categoria text not null check (categoria in ('rosas','arreglos','tropicales','plantas')),
  precio numeric(10,2) not null check (precio > 0),
  stock int not null default 0 check (stock >= 0),
  imagen_url text, -- URL en Supabase Storage (bucket "productos")
  created_at timestamptz default now()
);

create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  comerciante_id uuid not null references public.comerciantes(id),
  cliente text not null,
  telefono text not null check (telefono ~ '^9[0-9]{8}$'),
  tipo_entrega text not null check (tipo_entrega in ('retiro','delivery')),
  direccion text,
  total numeric(10,2) not null check (total >= 0),
  estado text not null default 'pendiente'
    check (estado in ('pendiente','confirmado','listo','entregado','cancelado')),
  created_at timestamptz default now()
);

create table public.pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  producto_id uuid not null references public.productos(id),
  cantidad int not null check (cantidad > 0),
  precio_unitario numeric(10,2) not null
);

alter table public.comerciantes enable row level security;
alter table public.productos enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_items enable row level security;

-- Perfiles y catálogo: lectura pública
create policy "perfiles publicos" on public.comerciantes for select using (true);
create policy "catalogo publico" on public.productos for select using (true);

-- Cada comerciante gestiona SOLO sus propios recursos
create policy "editar mi perfil" on public.comerciantes for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "gestionar mis productos" on public.productos for all
  using (auth.uid() = comerciante_id) with check (auth.uid() = comerciante_id);

-- Pedidos: cualquier cliente puede crear; solo el comerciante dueño los ve y actualiza
create policy "crear pedido" on public.pedidos for insert with check (estado = 'pendiente');
create policy "ver mis pedidos" on public.pedidos for select using (auth.uid() = comerciante_id);
create policy "actualizar mis pedidos" on public.pedidos for update using (auth.uid() = comerciante_id);

create policy "crear items" on public.pedido_items for insert with check (true);
create policy "ver items de mis pedidos" on public.pedido_items for select
  using (exists (select 1 from public.pedidos p where p.id = pedido_id and p.comerciante_id = auth.uid()));
