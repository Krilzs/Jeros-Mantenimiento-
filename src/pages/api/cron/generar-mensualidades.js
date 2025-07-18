import createServiceClient from "@/utils/lib/supabaseService";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const supabase = createServiceClient();
  const mesActual = dayjs().month() + 1;
  const anioActual = dayjs().year();

  const { data: clientes, error: errorClientes } = await supabase
    .from("clientes")
    .select("id, monto_mensual");

  if (errorClientes)
    return res.status(500).json({ error: errorClientes.message });

  for (const cliente of clientes) {
    const { data: yaExiste } = await supabase
      .from("pagos_mensualidades")
      .select("id")
      .eq("cliente_id", cliente.id)
      .eq("mes", mesActual)
      .maybeSingle();

    if (!yaExiste) {
      const { error } = await supabase.from("pagos_mensualidades").insert({
        cliente_id: cliente.id,
        mes: mesActual,
        anio: anioActual,
        monto_mensual: cliente.monto_mensual,
        monto_pagado: 0,
      });

      if (error) return res.status(500).json({ error: error.message });
    }
  }

  res.status(200).json({
    ok: true,
    mensaje: "Mensualidades creadas correctamente",
  });
}
