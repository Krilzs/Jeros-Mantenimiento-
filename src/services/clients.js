// src/services/clients.js
import { getData } from "@/utils/utils";
import { supabase } from "@/utils/lib/supabaseClient";
const BASE_URL = "/api/clients";

export const fetchClientesService = async () => {
  const token = await getData(supabase);
  const res = await fetch(`${BASE_URL}/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener clientes");
  return res.json();
};

export const createClient = async (data) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear cliente");
  return res.json();
};

export const editClient = async (data) => {
  console.log(data);
  const token = await getData(supabase);
  const res = await fetch(`${BASE_URL}/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar cliente");
  return res.json();
};

export const editMultipleClients = async (data) => {
  const token = await getData(supabase);
  const res = await fetch(`${BASE_URL}/edit-multiple`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar multiples clientes");
  return res.json();
};

export const removeClient = async (id) => {
  const res = await fetch(`${BASE_URL}/remove?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar cliente");
  return res.json();
};
