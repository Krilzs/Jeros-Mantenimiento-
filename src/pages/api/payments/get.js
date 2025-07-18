import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { clienteId } = req.query;

  if (!clienteId) {
    return res.status(400).json({ error: "Falta el clienteId" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Falta el token" });
  }

  const supabase = createServerClient({ token });

  // Podés validar usuario con supabase.auth.getUser(token) si querés

  const { data, error } = await supabase
    .from("pagos")
    .select("id, fecha_pago, monto_pagado,descripcion")
    .eq("cliente_id", clienteId)
    .order("fecha_pago", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
