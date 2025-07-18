import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Falta token" });

  const supabase = createServerClient({ token });

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return res.status(401).json({ error: "Usuario inválido" });
  }

  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const userId = userData.user.id;

  const { data: clientes, error: clientesError } = await supabase
    .from("clientes")
    .select("id, nombre")
    .eq("usuario_id", userId);

  if (clientesError) {
    return res.status(500).json({ error: clientesError.message });
  }

  const clienteIds = clientes.map((c) => c.id);

  if (clienteIds.length === 0) {
    return res.status(200).json([]); // no hay clientes → no hay pagos
  }

  const { data, error } = await supabase
    .from("pagos")
    .select("id, fecha_pago, monto_pagado, descripcion,clientes(nombre)")
    .gte("fecha_pago", desde)
    .lte("fecha_pago", hasta)
    .in("cliente_id", clienteIds);

  if (error) return res.status(500).json({ error: error.message });

  console.log(data);

  res.status(200).json({ data });
}
