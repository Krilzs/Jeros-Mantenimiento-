// pages/api/clients/edit-multiple.js
import { createServerClient } from "@/utils/lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Falta el token" });

  const supabase = createServerClient({ token });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user)
    return res.status(401).json({ error: "Usuario no autenticado" });

  const clientes = req.body.clientes; // Array de objetos {id, monto_mensual}

  console.log(clientes);

  if (!Array.isArray(clientes) || clientes.length === 0) {
    return res.status(400).json({ error: "No hay clientes para actualizar" });
  }

  const errores = [];
  const actualizados = [];

  for (const cliente of clientes) {
    const { id, monto_mensual } = cliente;
    if (!id || typeof monto_mensual !== "number") {
      errores.push({ id, error: "Faltan datos o monto inválido" });
      continue;
    }

    // Solo permitimos actualizar monto_mensual y que sea del usuario
    const { data, error } = await supabase
      .from("clientes")
      .update({ monto_mensual })
      .eq("id", id)
      .eq("usuario_id", user.id)
      .select()
      .single();

    if (error) {
      errores.push({ id, error: error.message });
    } else {
      actualizados.push(data);
    }
  }

  if (errores.length > 0) {
    return res
      .status(207)
      .json({ message: "Algunos errores ocurrieron", errores, actualizados });
  }

  return res
    .status(200)
    .json({ message: "Todos los clientes actualizados", actualizados });
}
