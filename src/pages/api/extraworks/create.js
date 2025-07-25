import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Falta token" });
  }

  const supabase = createServerClient({ token });

  const { cliente_id, monto_cobrado, fecha, descripcion } = req.body;
  if (!descripcion || !monto_cobrado || !fecha || !cliente_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const trabajo_extra = {
    descripcion,
    monto_cobrado,
    fecha,
    cliente_id,
  };

  const pago = {
    descripcion,
    monto_pagado: monto_cobrado,
    fecha_pago: fecha,
    cliente_id,
  };

  console.log("PAGO", pago);

  const { data: pagoData, error: pagoError } = await supabase
    .from("pagos")
    .insert([pago]);

  const { data: trabajoData, error: trabajoError } = await supabase
    .from("trabajos_extras")
    .insert([trabajo_extra]);

  console.log("DATA:", trabajoData);

  if (trabajoError || pagoError) {
    return res.status(500).json({ error: error.message });
  }

  return res
    .status(200)
    .json({ message: "Trabajo extra registrado", trabajoData });
}
