import DashboardLayout from "@/components/layout/DashboardLayout";
import { Heading, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import LoadingScreen from "@/components/LoadingScreen";
import ClientesTable from "@/components/clients/ClientTable";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/lib/supabaseClient";
import { getData, calcularEstadoPago, sortBy } from "@/utils/utils";
import EditarMontoModal from "@/components/clients/EditarMontoModal";
import { useDisclosure } from "@chakra-ui/react";
import ClientViewModal from "@/components/clients/ClientViewModal";

import ClientsActions from "@/components/clients/ClientsActions";
export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const toast = useToast();
  const [clienteEditando, setClienteEditando] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState("nombre");
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  function toggleSeleccion(id) {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function handleGuardarMultiples(clientesActualizados) {
    const token = await getData(supabase);

    try {
      const res = await fetch("/api/clients/edit-multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clientes: clientesActualizados }),
      });

      if (!res.ok && res.status !== 207)
        throw new Error(data.error || "Error desconocido");

      const data = await res.json();

      toast({
        title: "Clientes actualizados",
        description: `Se actualizaron ${data.actualizados.length} clientes`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      fetchClientes();

      setSeleccionados([]);
    } catch (error) {
      toast({
        title: "Error actualizando clientes",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }

  const clientesFiltrados = sortBy(
    clients.filter((c) =>
      c.nombre.toLowerCase().includes(filtro.toLowerCase())
    ),
    ordenarPor,
    ordenAscendente
  );

  const handleClienteCreado = (nuevoCliente) => {
    setClients((prev) => [...prev, nuevoCliente]);
  };

  async function fetchClientes() {
    setLoading(true);
    const token = await getData(supabase);
    try {
      const res = await fetch("/api/clients/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error desconocido");

      const clientesConEstado = data.map((cliente) => ({
        ...cliente,
        estado_pago: calcularEstadoPago(cliente.ultimo_pago),
      }));

      setClients(clientesConEstado);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  function handleView(cliente) {
    setClienteSeleccionado(cliente);
    setIsViewOpen(true);
  }

  function handleCloseView() {
    setIsViewOpen(false);
    setClienteSeleccionado(null);
  }

  async function handleEdit(cliente, nuevoMonto) {
    setClienteEditando(cliente);
    onOpen();
  }

  async function handleGuardarEdicion(cliente, nuevoMonto) {
    const token = await getData(supabase);

    const res = await fetch("/api/clients/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: cliente.id,
        montoMensual: nuevoMonto,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast({
        title: "Error al actualizar monto",
        description: data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Monto actualizado",
        description: `Nuevo monto: $${data.monto_mensual}`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      // Actualizá el cliente en tu lista
      setClients((prev) =>
        prev.map((c) =>
          c.id === cliente.id ? { ...c, monto_mensual: data.monto_mensual } : c
        )
      );

      onClose();
    }
  }

  async function handleDelete(cliente) {
    const token = await getData(supabase);
    console.log(cliente);

    try {
      const res = await fetch("/api/clients/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",

        body: JSON.stringify({ id: cliente.id }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error desconocido");

      toast({
        title: "Cliente eliminado",
        description: `Se eliminó correctamente a ${cliente.nombre}`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setClients((prev) => prev.filter((c) => c.id !== cliente.id));
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: `No se pudo eliminar a ${cliente.nombre}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.error(`Error Eliminando cliente: ${cliente.nombre}`, error);
    }
  }

  return (
    <DashboardLayout>
      <Heading color="green.700" mb={4}>
        Clientes
      </Heading>
      <Text color="gray.600">
        Maneja y controla la informacion de tus clientes.
      </Text>
      {loading ? (
        <LoadingScreen fullscreen={false} />
      ) : (
        <>
          <ClientsActions
            onSearch={setFiltro}
            onClientCreated={handleClienteCreado}
            seleccionados={seleccionados}
            clientes={clients}
            onGuardarMultiples={handleGuardarMultiples}
          />
          <ClientesTable
            clientes={clientesFiltrados}
            seleccionados={seleccionados}
            toggleSeleccion={toggleSeleccion}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            ordenarPor={ordenarPor}
            ordenAscendente={ordenAscendente}
            setOrdenarPor={setOrdenarPor}
            setOrdenAscendente={setOrdenAscendente}
          />
        </>
      )}
      {clienteEditando && (
        <EditarMontoModal
          isOpen={isOpen}
          onClose={onClose}
          cliente={clienteEditando}
          onSave={handleGuardarEdicion}
        />
      )}
      <ClientViewModal
        isOpen={isViewOpen}
        onClose={handleCloseView}
        cliente={clienteSeleccionado}
      />
    </DashboardLayout>
  );
}
