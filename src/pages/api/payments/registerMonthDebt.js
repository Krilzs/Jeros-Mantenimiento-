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

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return res.status(401).json({ error: "Usuario inválido" });
  }

  const { monto, fecha, cliente_id, mes_asignado } = req.body;

  if (!monto || !fecha || !cliente_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const [anioStr, mesStr] = mes_asignado.split("-");
  const anio = parseInt(anioStr);
  const mes = parseInt(mesStr);

  const { data: actual, error: errActual } = await supabase
    .from("pagos_mensualidades")
    .select("monto_pagado")
    .eq("cliente_id", cliente_id)
    .eq("mes", mes)
    .eq("anio", anio)
    .single();

  if (actual) {
    return res.status(500).json({ error: "Mes ya registrado por el cliente" });
  }

  if (errActual) {
    const { error: errorDeuda } = await supabase
      .from("pagos_mensualidades")
      .insert([
        {
          cliente_id: cliente_id,
          mes: mes,
          anio: anio,
          monto_mensual: monto,
          monto_pagado: 0,
          fecha_pago: fecha,
        },
      ]);

    if (errorDeuda) {
      console.error("Error creando deuda:", errorDeuda);
      return res.status(500).json({ error: errorDeuda.message });
    }
  }

  return res.status(200).json({ message: "Deuda Registrada" });
}
