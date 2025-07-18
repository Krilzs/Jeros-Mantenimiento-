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

  const { data, error } = await supabase
    .from("gastos")
    .select("id, fecha, monto, nombre")
    .gte("fecha", desde)
    .lte("fecha", hasta)
    .eq("usuario_id", userId);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ data });
}
