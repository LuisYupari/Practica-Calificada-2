"use client";

import { useState } from "react";
import { getSupabase } from "../../lib/supabase";

export default function Login() {
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setMensaje("Supabase no está configurado (falta .env.local). Modo demostración.");
      return;
    }
    const { error } =
      modo === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setMensaje(error ? `Error: ${error.message}` : modo === "login" ? "Sesión iniciada" : "Registro exitoso, revisa tu correo");
  }

  return (
    <form onSubmit={enviar} className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">{modo === "login" ? "Iniciar sesión" : "Registro de comerciante"}</h1>
      <input className="mb-2 w-full rounded border p-2" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="mb-2 w-full rounded border p-2" type="password" placeholder="Contraseña (mín. 8)" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="w-full rounded bg-rose-600 p-2 text-white">{modo === "login" ? "Ingresar" : "Registrarme"}</button>
      <button type="button" onClick={() => setModo(modo === "login" ? "registro" : "login")} className="mt-2 w-full text-sm text-rose-700 underline">
        {modo === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Ingresa"}
      </button>
      {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
    </form>
  );
}
