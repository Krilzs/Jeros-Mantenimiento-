import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Heading,
  Checkbox,
} from "@chakra-ui/react";
import ModalHistorial from "../components/payments/HistoryPaymentsModal";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getData } from "@/utils/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/lib/supabaseClient";
import LoadingScreen from "@/components/LoadingScreen";

export default function Pagos() {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const {
    isOpen: isHistoryOpen,
    onOpen: openHistoryModal,
    onClose: closeHistoryModal,
  } = useDisclosure();
  const [pagos, setPagos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    tipo: "cobro",
    nombre: "",
    cliente_id: "",
    monto: "",
    fecha: "",
    asignarMensualidad: false,
    mes_asignado: "",
  });

  const toast = useToast();

  console.log(gastos);
  useEffect(() => {
    fetchPagos();
    fetchGastos();
    fetchClientes();
  }, []);

  const checkLoading = () => {
    if (!pagos || !gastos || !clientes) setLoading(true);
    else setLoading(false);
  };

  const resetForm = () => {
    setForm({
      tipo: "cobro",
      nombre: "",
      cliente_id: "",
      monto: "",
      fecha: "",
      asignarMensualidad: false,
      mes_asignado: "",
    });
  };

  const movimientos = [
    ...pagos.map((p) => ({
      id: p.id,
      tipo: "cobro",
      fecha: p.fecha_pago,
      nombre: p.cliente?.nombre || "—",
      monto: p.monto_pagado,
    })),
    ...gastos.map((g) => ({
      id: g.id,
      tipo: "gasto",
      fecha: g.fecha,
      nombre: g.nombre,
      monto: g.monto,
    })),
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const ingresos = movimientos
    .filter((m) => m.tipo === "cobro")
    .reduce((acc, m) => acc + m.monto, 0);

  const egresos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + m.monto, 0);

  const balance = ingresos - egresos;

  const movimientosPorPagina = 8;

  const totalPaginas = Math.ceil(movimientos.length / movimientosPorPagina);
  const movimientosVisibles = movimientos.slice(
    (paginaActual - 1) * movimientosPorPagina,
    paginaActual * movimientosPorPagina
  );

  const fetchClientes = async () => {
    const token = await getData(supabase);
    try {
      const res = await fetch("/api/clients/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setClientes(data);
      checkLoading();
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  const fetchPagos = async () => {
    const token = await getData(supabase);
    try {
      const res = await fetch("/api/payments/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      setPagos(data);
      checkLoading();
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
      setPagos([]);
    }
  };

  const fetchGastos = async () => {
    const token = await getData(supabase);
    try {
      const res = await fetch("/api/spent/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setGastos(data);
      checkLoading();
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
      setGastos([]);
    }
  };

  const handleSubmit = async () => {
    const endpoint =
      form.tipo === "cobro" ? "/api/payments/create" : "/api/spent/create";
    const payload =
      form.tipo === "cobro"
        ? {
            cliente_id: form.cliente_id,
            monto_pagado: parseFloat(form.monto),
            fecha_pago: form.fecha,
            mes_asignado: form.asignarMensualidad ? form.mes_asignado : null,
          }
        : {
            monto: parseFloat(form.monto),
            fecha: form.fecha,
            nombre: form.nombre,
          };

    if (!form.cliente_id && form.tipo === "cobro") {
      toast({
        title: "Error al guardar el movimiento",
        description: "Debes seleccionar un cliente",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!form.monto || !form.fecha) {
      toast({
        title: "Error al guardar el movimiento",
        description: "Debes completar todos los campos",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = await getData(supabase);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast({
          title: "Error al guardar el movimiento",
          description: res.statusText,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw new Error("Error al guardar el movimiento");
      }

      closeModal();
      fetchPagos();
      fetchGastos();
      resetForm();

      toast({
        title: "Movimiento guardado",
        description: "Movimiento registrado correctamente",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Podés agregar un callback para recargar la lista si querés
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Heading color="green.700" mb={5}>
          Pagos y Gastos
        </Heading>
        <Text color="gray.600" mb={40}>
          Resumen general sobre pagos de clientes.
        </Text>
        <LoadingScreen fullscreen={false} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box mx="auto" p={4}>
        <Box bg="gray.50" rounded="md" mb={4}>
          <Text>Ingresos: ${ingresos}</Text>
          <Text>Gastos: ${egresos}</Text>
          <Text fontWeight="bold">Balance: ${balance}</Text>
        </Box>
        <Box display="flex" justifyContent="start" width={"100%"} gap={2}>
          <Button colorScheme="blue" onClick={openModal} mb={4}>
            Nuevo Movimiento
          </Button>
          <Button
            variant={"outline"}
            colorScheme="blue"
            onClick={openHistoryModal}
            mb={4}
          >
            Historial de Pagos
          </Button>
        </Box>
        <ModalHistorial
          isOpen={isHistoryOpen}
          onClose={closeHistoryModal}
          clienteId={form.cliente_id}
        />

        <Table variant="simple" mt={6}>
          <Thead>
            <Tr>
              <Th>Fecha</Th>
              <Th>Tipo</Th>
              <Th>Gasto/Cliente</Th>
              <Th isNumeric>Monto</Th>
            </Tr>
          </Thead>
          <Tbody>
            {movimientosVisibles.map((m) => (
              <Tr key={`${m.tipo}-${m.id}`}>
                <Td>{m.fecha.split("-").reverse().join("/")}</Td>
                <Td color={m.tipo === "gasto" ? "red.500" : "green.500"}>
                  {m.tipo.toLocaleUpperCase()}
                </Td>
                <Td>{m.nombre}</Td>
                <Td
                  isNumeric
                  color={m.tipo === "gasto" ? "red.500" : "green.500"}
                >
                  {m.tipo === "gasto" ? "-" : "+"}${m.monto}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            size={"sm"}
            colorScheme={paginaActual === 1 ? "gray" : "brand"}
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            isDisabled={paginaActual === 1}
          >
            Anterior
          </Button>
          <Text px={2} display={"flex"} justifyContent="center" align="center">
            Página {paginaActual} de {totalPaginas}
          </Text>
          <Button
            size={"sm"}
            colorScheme={paginaActual === totalPaginas ? "gray" : "brand"}
            onClick={() =>
              setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }
            isDisabled={paginaActual === totalPaginas}
          >
            Siguiente
          </Button>
        </Box>

        {/* Modal para agregar movimiento */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Registrar Movimiento</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={3}>
                <FormLabel>Tipo</FormLabel>
                <Select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                >
                  <option value="cobro">Cobro</option>
                  <option value="gasto">Gasto</option>
                </Select>
              </FormControl>
              {form.tipo === "cobro" && (
                <>
                  <FormControl mb={3}>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      value={form.cliente_id}
                      onChange={(e) =>
                        setForm({ ...form, cliente_id: e.target.value })
                      }
                    >
                      <option value="">Seleccionar cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl display="flex" alignItems="center" mb={3}>
                    <Checkbox
                      isChecked={form.asignarMensualidad}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          asignarMensualidad: e.target.checked,
                        })
                      }
                      mr={2}
                    />
                    <FormLabel mb={0}>Asignar a mensualidad</FormLabel>
                  </FormControl>

                  {form.asignarMensualidad && (
                    <FormControl mb={3}>
                      <FormLabel>Mes del corte (YYYY-MM)</FormLabel>
                      <Input
                        type="month"
                        value={form.mes_asignado || ""}
                        onChange={(e) =>
                          setForm({ ...form, mes_asignado: e.target.value })
                        }
                      />
                    </FormControl>
                  )}
                </>
              )}
              {form.tipo === "gasto" && (
                <FormControl mb={3}>
                  <FormLabel>Nombre de gasto</FormLabel>
                  <Input
                    type="text"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                  />
                </FormControl>
              )}
              <FormControl mb={3}>
                <FormLabel>Monto</FormLabel>

                <Input
                  type="number"
                  value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Fecha de realizacion</FormLabel>
                <Input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Guardar
              </Button>
              <Button onClick={closeModal}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </DashboardLayout>
  );
}
