import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
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

  const userId = userData.user.id;

  const { data: gastos, error: gastosError } = await supabase
    .from("gastos")
    .select("*")
    .eq("usuario_id", userId);

  if (gastosError) {
    return res.status(500).json({ error: gastosError.message });
  }

  return res.status(200).json(gastos);
}
