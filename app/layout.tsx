import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MercadoAcho",
  description: "Catálogo digital del Mercado de Flores de Acho"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-rose-50 text-gray-800">
        <header className="bg-rose-700 text-white">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 p-4">
            <Link href="/" className="text-xl font-bold">🌸 MercadoAcho</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/">Catálogo</Link>
              <Link href="/panel">Panel comerciante</Link>
              <Link href="/login">Ingresar</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
