import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Falta el token" });
  }

  const supabase = createServerClient({ token });

  try {
    const { data, error } = await supabase.from("clientes").select(`
      id,
      nombre,
      pagos_mensualidades (
        monto_pagado,
        monto_mensual
      )
    `);

    if (error) {
      console.error("Error al obtener datos:", error);
      res.status(500).json({ error: "Error al obtener clientes" });
      return;
    }

    let estadosClientes = [
      { name: "Adeudados", value: 0 },
      { name: "Al dia", value: 0 },
    ];
    // Procesar los datos y retornar el estado de pago

    data.forEach((cliente) => {
      const tieneDeuda = cliente.pagos_mensualidades.some(
        (pago) => pago.monto_pagado < pago.monto_mensual
      );
      if (tieneDeuda) {
        estadosClientes[0].value += 1; // Adeudados
      } else {
        estadosClientes[1].value += 1; // Al dia
      }
    });

    res.status(200).json(estadosClientes);
  } catch (error) {
    console.error("Error al obtener clientes con estado de pago:", error);
    res
      .status(500)
      .json({ error: "Error al obtener clientes con estado de pago" });
  }
}
