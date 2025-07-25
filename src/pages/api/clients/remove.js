import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Falta el token" });
  }

  const supabase = createServerClient({ token });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ error: "Falta el ID del cliente a eliminar" });
  }

  const { error: deleteError } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id); 

  console.log(deleteError);

  if (deleteError) {
    return res.status(500).json({ error: deleteError.message });
  }

  return res.status(200).json({ message: "Cliente eliminado correctamente" });
}
