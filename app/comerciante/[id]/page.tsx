import { notFound } from "next/navigation";
import { comerciantes, productos } from "../../../lib/data";

export default async function PerfilComerciante({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = comerciantes.find((x) => x.id === id);
  if (!c) notFound();
  const suyos = productos.filter((p) => p.comercianteId === c.id);
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">{c.nombre}</h1>
      <p className="text-gray-500">{c.puesto} · Mercado de Flores de Acho</p>
      <p className="mt-2">{c.descripcion}</p>
      <h2 className="mt-4 font-semibold">Productos</h2>
      <ul className="list-disc pl-6">
        {suyos.map((p) => <li key={p.id}>{p.emoji} {p.nombre} – S/ {p.precio}</li>)}
      </ul>
    </div>
  );
}
