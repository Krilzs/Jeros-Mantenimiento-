import { Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";

export default function MovimientosTable({ movimientos, tipo }) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Cliente</Th>
          <Th>Monto</Th>
          <Th>Fecha</Th>
        </Tr>
      </Thead>
      <Tbody>
        {movimientos.map((mov) => (
          <Tr key={mov.id}>
            <Td>
              <Text fontWeight="medium">{mov.cliente?.nombre || "Sin cliente"}</Text>
            </Td>
            <Td color={tipo === "ingreso" ? "green.500" : "red.500"}>
              ${mov.monto}
            </Td>
            <Td>{new Date(mov.fecha).toLocaleDateString()}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}