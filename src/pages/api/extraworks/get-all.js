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

  const { data: clientes, error: clientesError } = await supabase
    .from("clientes")
    .select("id, nombre, lote")
    .eq("usuario_id", userId);

  const clientesIds = clientes.map((cliente) => cliente.id);

  const { data: trabajos, error: trabajosError } = await supabase
    .from("trabajos_extras")
    .select("*")
    .in("cliente_id", clientesIds);

  trabajos.forEach((trabajo) => {
    const cliente = clientes.find((c) => c.id === trabajo.cliente_id);
    if (cliente) {
      trabajo.cliente = cliente.nombre;
      trabajo.lote = cliente.lote;
    }
  });

  res.status(200).json(trabajos);
}
