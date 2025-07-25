import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
} from "@chakra-ui/react";
import { getData } from "@/utils/utils";
import { supabase } from "@/utils/lib/supabaseClient";
import { useState } from "react";
import { formatCashNumber } from "@/utils/utils";

export default function ModalHistorial({ isOpen, onClose }) {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const toast = useToast();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(historial.length / itemsPerPage);

  const paginatedHistorial = historial.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const fetchHistorial = async () => {
    if (!desde || !hasta) {
      toast({
        title: "Debes completar ambas fechas",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const token = await getData(supabase);

    try {
      const [resPagos, resGastos] = await Promise.all([
        fetch(`/api/payments/get-by-date?desde=${desde}&hasta=${hasta}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`/api/spent/get-by-date?desde=${desde}&hasta=${hasta}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const pagosData = await resPagos.json();
      const gastosData = await resGastos.json();

      if (!resPagos.ok)
        throw new Error(pagosData.error || "Error al obtener pagos");
      if (!resGastos.ok)
        throw new Error(gastosData.error || "Error al obtener gastos");

      const pagos = (pagosData.data || []).map((p) => ({
        id: `p-${p.id}`,
        tipo: "Cobro",
        fecha: p.fecha_pago,
        monto: p.monto_pagado,
        descripcion: p.descripcion || "-",
        cliente: p.clientes?.nombre || "—",
      }));

      const gastos = (gastosData.data || []).map((g) => ({
        id: `g-${g.id}`,
        tipo: "Gasto",
        fecha: g.fecha,
        monto: g.monto,
        descripcion: g.nombre || g.descripcion || "-",
        cliente: null,
      }));

      const combinado = [...pagos, ...gastos].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      setHistorial(combinado);
      setPage(1); // reset paginación
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  const totalPagos = historial
    .filter((item) => item.tipo === "Cobro")
    .reduce((sum, item) => sum + item.monto, 0);

  const totalGastos = historial
    .filter((item) => item.tipo === "Gasto")
    .reduce((sum, item) => sum + item.monto, 0);

  const balance = totalPagos - totalGastos;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Historial de Cobros y Gastos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              placeholder="Desde"
            />
            <Input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              placeholder="Hasta"
            />
            <Button
              onClick={fetchHistorial}
              colorScheme="blue"
              isLoading={loading}
              alignSelf="flex-start"
            >
              Buscar
            </Button>

            {historial.length > 0 ? (
              <>
                {/* Resumen financiero */}
                <HStack
                  justify="space-between"
                  bg="gray.50"
                  p={3}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <Text color="green.600" fontWeight="bold">
                    Total Cobro: {formatCashNumber(totalPagos)}
                  </Text>
                  <Text color="red.800" fontWeight="bold">
                    Total Gastos: {formatCashNumber(totalGastos)}
                  </Text>
                  <Text
                    color={balance >= 0 ? "green.700" : "red.800"}
                    fontWeight="bold"
                  >
                    Balance: {formatCashNumber(balance)}
                  </Text>
                </HStack>

                <Table variant="striped" colorScheme="gray" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Fecha</Th>
                      <Th>Tipo</Th>
                      <Th>Monto</Th>
                      <Th>Descripción</Th>
                      <Th>Cliente</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedHistorial.map((item) => (
                      <Tr
                        key={item.id}
                        bg={item.tipo === "Gasto" ? "red.50" : "green.50"}
                      >
                        <Td>
                          {item.fecha
                            ? new Date(item.fecha).toLocaleDateString()
                            : "—"}
                        </Td>
                        <Td>{item.tipo}</Td>
                        <Td
                          color={
                            item.tipo === "Gasto" ? "red.500" : "green.600"
                          }
                        >
                          {formatCashNumber(item.monto)}
                        </Td>
                        <Td>{item.descripcion}</Td>
                        <Td>{item.cliente ?? "—"}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Paginación */}
                <HStack justify="center" mt={4}>
                  <Button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    isDisabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <Text>
                    Página {page} de {totalPages}
                  </Text>
                  <Button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    isDisabled={page === totalPages}
                  >
                    Siguiente
                  </Button>
                </HStack>
              </>
            ) : (
              <Text color="gray.500" fontSize="sm">
                No hay resultados en este rango
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
