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

  const pago = {
    monto_pagado: monto,
    descripcion: `Pago mensualidad ${mes_asignado}`,
    fecha_pago: fecha,
    cliente_id: cliente_id,
  };

  const { data, error } = await supabase.from("pagos").insert([pago]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const [anioStr, mesStr] = mes_asignado.split("-"); // ["2025", "07"]
  const anio = parseInt(anioStr);
  const mes = parseInt(mesStr);

  const { data: actual, error: errActual } = await supabase
    .from("pagos_mensualidades")
    .select("monto_pagado")
    .eq("cliente_id", cliente_id)
    .eq("mes", mes)
    .eq("anio", anio)
    .single();

  console.log("ACTUAL", actual);

  if (errActual) {
    const { error: errorPago } = await supabase
      .from("pagos_mensualidades")
      .insert([
        {
          cliente_id: cliente_id,
          mes: mes,
          anio: anio,
          monto_mensual: monto,
          monto_pagado: monto,
          fecha_pago: fecha,
        },
      ]);

    if (errorPago) {
      console.error("Error creando pago:", errorPago);
      return res.status(500).json({ error: errorPago.message });
    }
  } else if (!errActual) {
    const nuevoMonto = parseInt(actual.monto_pagado) + parseInt(monto);
    const { error: errUpdate } = await supabase
      .from("pagos_mensualidades")
      .update({ monto_pagado: nuevoMonto, fecha_pago: fecha })
      .eq("cliente_id", cliente_id)
      .eq("mes", mes)
      .eq("anio", anio);

    if (errUpdate) {
      console.log(errUpdate);
      return res.status(500).json({
        error: "Error al actualizar pagos_mensualidades",
        detalle: errUpdate.message,
      });
    }
  }

  return res.status(200).json({ message: "Movimiento creado", data });
}
