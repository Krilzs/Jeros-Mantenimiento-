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

  const { nombre, monto, fecha } = req.body;

  if (!nombre || !monto || !fecha) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Obtenemos el usuario desde el token
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log(user);

  if (userError || !user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const gasto = {
    nombre,
    monto,
    fecha,
    usuario_id: user.id,
  };

  const { data, error } = await supabase.from("gastos").insert([gasto]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: "Gasto registrado", data });
}
