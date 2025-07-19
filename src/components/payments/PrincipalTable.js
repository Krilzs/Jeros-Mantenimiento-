import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export default function PrincipalTable({ movimientosVisibles }) {
  return (
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
            <Td isNumeric color={m.tipo === "gasto" ? "red.500" : "green.500"}>
              {m.tipo === "gasto" ? "-" : "+"}${m.monto}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
