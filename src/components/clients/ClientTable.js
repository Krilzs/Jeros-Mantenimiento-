import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import AddNewMonth from "./AddNewMonth";
import { useState } from "react";

export default function ClientesTable({
  clientes,
  onView,
  onEdit,
  seleccionados,
  toggleSeleccion,
  ordenarPor,
  ordenAscendente,
  setOrdenarPor,
  setOrdenAscendente,
}) {
  const handleOrden = (campo) => {
    if (ordenarPor === campo) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdenAscendente(true);
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);

  const handleModalOpen = (cliente) => {
    setClientInfo(cliente);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setClientInfo(null);
    setModalOpen(false);
  };
  const clientesOrdenados = [...clientes].sort((a, b) => {
    const valorA = a[ordenarPor];
    const valorB = b[ordenarPor];

    if (typeof valorA === "string" && typeof valorB === "string") {
      return ordenAscendente
        ? valorA.localeCompare(valorB)
        : valorB.localeCompare(valorA);
    }

    if (valorA instanceof Date && valorB instanceof Date) {
      return ordenAscendente ? valorA - valorB : valorB - valorA;
    }

    return ordenAscendente ? valorA - valorB : valorB - valorA;
  });

  return (
    <TableContainer>
      <Table variant="simple" size="md">
        <Thead bg="green.100">
          <Tr>
            <Th></Th>
            <Th onClick={() => handleOrden("nombre")} cursor="pointer">
              Nombre
            </Th>
            <Th onClick={() => handleOrden("lote")} cursor="pointer">
              Número de lote
            </Th>
            <Th onClick={() => handleOrden("monto_mensual")} cursor="pointer">
              Monto mensual
            </Th>
            <Th>Último pago</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clientes.length === 0 ? (
            <Tr>
              <Td colSpan="7" textAlign="center">
                No hay clientes cargados.
              </Td>
            </Tr>
          ) : (
            clientesOrdenados.map((cliente) => (
              <Tr key={cliente.id}>
                <Td>
                  <Checkbox
                    isChecked={seleccionados.includes(cliente.id)}
                    onChange={() => toggleSeleccion(cliente.id)}
                  />
                </Td>
                <Td>{cliente.nombre}</Td>
                <Td>{cliente.lote}</Td>
                <Td fontWeight={"bold"} color={"brand.800"}>
                  ${cliente.monto_mensual.toLocaleString()}
                </Td>
                <Td>
                  {cliente.ultimo_pago
                    ? cliente.ultimo_pago
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")
                    : "Sin pagos"}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="green"
                    mr={2}
                    onClick={() => onView(cliente)}
                  >
                    Datos del cliente
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    mr={2}
                    colorScheme="brand"
                    onClick={() => onEdit(cliente)}
                  >
                    Editar Valor Mensual
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    mr={2}
                    colorScheme="blue"
                    onClick={() => handleModalOpen(cliente)}
                  >
                    Agendar Pago/Deuda
                  </Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {modalOpen && (
        <AddNewMonth cliente={clientInfo} onClose={handleModalClose} />
      )}
    </TableContainer>
  );
}
