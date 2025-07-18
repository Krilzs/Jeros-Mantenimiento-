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
    const { data: clientesData, error: clientesError } = await supabase
      .from("clientes")
      .select("*");

    if (clientesError) throw clientesError;

    // Por cada cliente, traer último pago
    const clientesConPagos = await Promise.all(
      clientesData.map(async (cliente) => {
        const { data: pagos, error: pagosError } = await supabase
          .from("pagos")
          .select("fecha_pago")
          .eq("cliente_id", cliente.id)
          .order("fecha_pago", { ascending: false })
          .limit(1)
          .single();

        if (pagosError && pagosError.code !== "PGRST116") throw pagosError;

        return {
          ...cliente,
          ultimo_pago: pagos ? new Date(pagos.fecha_pago) : null,
          // Quitamos estado_pago
        };
      })
    );

    res.status(200).json(clientesConPagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
}
