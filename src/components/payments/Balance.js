import { Box, Text } from "@chakra-ui/react";

export default function Balance({ balance, ingresos, egresos }) {
  return (
    <Box bg="gray.50" rounded="md" mb={4}>
      <Text>Ingresos: ${ingresos}</Text>
      <Text>Gastos: ${egresos}</Text>
      <Text fontWeight="bold">Balance: ${balance}</Text>
    </Box>
  );
}
