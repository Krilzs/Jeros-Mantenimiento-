import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { formatCashNumber } from "@/utils/utils";

export default function PrincipalTable({ movimientosVisibles }) {
  return (
    <Table variant="simple" mt={6}>
      <Thead>
        <Tr>
          <Th>Fecha</Th>
          <Th>Tipo</Th>
          <Th>Gasto/Cliente</Th>
          <Th isNumeric>Ingresos</Th>
          <Th isNumeric>Egresos</Th>
        </Tr>
      </Thead>
      <Tbody>
        {movimientosVisibles.map((m) => (
          <Tr sx={{p:0 , height:"fit-content"}} key={`${m.tipo}-${m.id}`}>
            <Td>{m.fecha.split("-").reverse().join("/")}</Td>
            <Td color={m.tipo === "gasto" ? "red.500" : "green.500"}>
              {m.tipo.toLocaleUpperCase()}
            </Td>
            <Td>{m.nombre}</Td>
            <Td isNumeric color={"green.500"}>
              {m.tipo !== "gasto" ? `${formatCashNumber(m.monto)}` : "-"}
            </Td>
            <Td isNumeric color={"red.500"}>
              {m.tipo === "gasto" ? `${formatCashNumber(m.monto)}` : "-"}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
