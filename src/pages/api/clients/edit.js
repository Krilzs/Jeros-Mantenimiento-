// pages/api/clients/edit.js

import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Falta el token" });

  const supabase = createServerClient({ token });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const { id, montoMensual } = req.body;

  if (!id || isNaN(montoMensual)) {
    return res
      .status(400)
      .json({ error: "Faltan datos o monto no es numérico" });
  }

  const { data, error } = await supabase
    .from("clientes")
    .update({ monto_mensual: montoMensual })
    .eq("id", id)
    .eq("usuario_id", user.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  console.log;

  return res.status(200).json(data);
}
