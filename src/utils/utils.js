export const getData = async (supabase) => {
  const { data } = await supabase.auth.getSession();

  return data.session?.access_token;
};

export function calcularEstadoPago(ultimoPagoStr) {
  if (!ultimoPagoStr) return "adeuda"; // sin pago registrado

  const fechaPago = new Date(ultimoPagoStr);
  const hoy = new Date();

  const diffMs = hoy - fechaPago;
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDias > 30 ? "adeuda" : "al_dia";
}

export function sortBy(array, campo, orden = "asc") {
  return [...array].sort((a, b) => {
    const valA = a[campo];
    const valB = b[campo];

    if (typeof valA === "string") {
      return orden === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    // para fechas o números
    return orden === "asc" ? valA - valB : valB - valA;
  });
}
