// pages/api/clients/create.js
import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Falta el token" });
  }

  const supabase = createServerClient({ token });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);


  if (userError || !user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const { nombre, lote, montoMensual } = req.body;
  const montoNum = Number(montoMensual);

  if (!nombre || !lote || isNaN(montoNum)) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios o el monto no es numérico" });
  }

  const { data, error: insertError } = await supabase
    .from("clientes")
    .insert([
      {
        nombre,
        lote,
        monto_mensual: montoNum,
        usuario_id: user.id,
      },
    ])
    .select("*");

  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  return res.status(201).json(data[0]);
}
