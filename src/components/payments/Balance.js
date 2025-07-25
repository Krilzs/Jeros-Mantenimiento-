import { Box, Text } from "@chakra-ui/react";
import { formatCashNumber } from "@/utils/utils";
export default function Balance({ balance, ingresos, egresos }) {
  return (
    <Box bg="gray.50" rounded="md" mb={4}>
      <Text>Ingresos: {formatCashNumber (ingresos)}</Text>
      <Text>Gastos: {formatCashNumber (egresos)}</Text>
      <Text fontWeight="bold">Balance: {formatCashNumber (balance)}</Text>
    </Box>
  );
}
