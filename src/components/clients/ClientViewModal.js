import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/lib/supabaseClient";
import { getData } from "@/utils/utils";

export default function ClientViewModal({ isOpen, onClose, cliente }) {
  const [loading, setLoading] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [mensualidades, setMensualidades] = useState([]);

  useEffect(() => {
    if (!cliente || !isOpen) return;

    async function fetchPagos() {
      setLoading(true);
      const token = await getData(supabase);
      try {
        const res = await fetch(`/api/payments/get?clienteId=${cliente.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al cargar pagos");
        setPagos(data);
      } catch (error) {
        console.error("Error cargando pagos:", error);
        setPagos([]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchMensualidades() {
      setLoading(true);
      const token = await getData(supabase);
      try {
        const res = await fetch(
          `/api/payments/get-monthy?clienteId=${cliente.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al cargar mensualidades");
        }
        setMensualidades(data);
      } catch (error) {
        console.error("Error cargando mensualidades:", error);
        setMensualidades([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPagos();
    fetchMensualidades();
  }, [cliente, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Historial de Pagos - {cliente?.nombre}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch" mb={4}>
            <Text>
              <b>Lote:</b> {cliente?.lote}
            </Text>
            <Text>
              <b>Monto mensual:</b> ${cliente?.monto_mensual}
            </Text>
          </VStack>

          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Pagos</Tab>
              <Tab>Mensualidades</Tab>
            </TabList>

            <TabPanels>
              {/* PESTAÑA PAGOS */}
              <TabPanel>
                {loading ? (
                  <Spinner size="lg" />
                ) : pagos.length === 0 ? (
                  <Text>No hay pagos registrados.</Text>
                ) : (
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Fecha</Th>
                        <Th>Descripción</Th>
                        <Th isNumeric>Monto</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {pagos.map((pago) => (
                        <Tr key={pago.id}>
                          <Td>
                            {pago.fecha_pago.split("-").reverse().join("/")}
                          </Td>
                          <Td>{pago.descripcion}</Td>
                          <Td isNumeric>
                            ${pago.monto_pagado.toLocaleString()}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </TabPanel>

              {/* PESTAÑA MENSUALIDADES */}
              <TabPanel>
                {loading ? (
                  <Spinner size="lg" />
                ) : mensualidades.length === 0 ? (
                  <Text>No hay mensualidades registradas.</Text>
                ) : (
                  <>
                    {/* CÁLCULO DEL SALDO */}
                    {(() => {
                      const totalMensual = mensualidades.reduce(
                        (acc, m) => acc + m.monto_mensual,
                        0
                      );
                      const totalPagado = mensualidades.reduce(
                        (acc, m) => acc + m.monto_pagado,
                        0
                      );
                      const diferencia = totalPagado - totalMensual;

                      return (
                        <Text fontWeight="bold" mb={2}>
                          Saldo {diferencia >= 0 ? "a favor" : "pendiente"}:{" "}
                          <span
                            style={{ color: diferencia >= 0 ? "green" : "red" }}
                          >
                            ${Math.abs(diferencia).toLocaleString()}
                          </span>
                        </Text>
                      );
                    })()}

                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Mes/Año</Th>
                          <Th isNumeric>Monto Mensual</Th>
                          <Th isNumeric>Monto Pagado</Th>
                          <Th>Fecha de Pago</Th>
                          <Th>Estado</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {mensualidades
                          .sort((a, b) => {
                            if (a.anio === b.anio) {
                              return a.mes - b.mes;
                            }
                            return a.anio - b.anio;
                          })
                          .map((m) => (
                            <Tr key={m.id}>
                              <Td>{`${m.mes}/${m.anio}`}</Td>
                              <Td isNumeric>
                                ${m.monto_mensual.toLocaleString()}
                              </Td>
                              <Td isNumeric>
                                ${m.monto_pagado.toLocaleString()}
                              </Td>

                              <Td width={"300px"}>
                                {m.monto_pagado == 0
                                  ? "No pagado aun"
                                  : m.fecha_pago.split("-").reverse().join("/")}
                              </Td>

                              <Td>
                                {m.monto_pagado >= m.monto_mensual ? (
                                  <Text color="green.600" fontWeight="bold">
                                    Pagado
                                  </Text>
                                ) : (
                                  <Text color="red.600" fontWeight="bold">
                                    Adeudado
                                  </Text>
                                )}
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
