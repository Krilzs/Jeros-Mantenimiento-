import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { Eye } from "lucide-react";

export default function MovimientosTable({ movimientos, onView }) {
  console.log(movimientos);
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Tipo</Th>
          <Th>Cliente</Th>
          <Th>Monto</Th>
          <Th>Fecha</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {movimientos.map((mov) => (
          <Tr key={mov.id}>
            <Td>{mov.tipo}</Td>
            <Td>{mov.cliente?.nombre ?? "-"}</Td>
            <Td>${mov.monto}</Td>
            <Td>{new Date(mov.fecha).toLocaleDateString()}</Td>
            <Td>
              <IconButton
                icon={<Eye size={18} />}
                aria-label="Ver"
                size="sm"
                onClick={() => onView(mov)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
