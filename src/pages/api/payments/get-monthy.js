import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Falta token" });

  const clienteId = req.query.clienteId;

  if (!clienteId) {
    return res.status(400).json({ error: "Falta clienteId" });
  }

  const supabase = createServerClient({ token });

  const { data, error } = await supabase
    .from("pagos_mensualidades")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("mes", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
