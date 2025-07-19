import { Button, HStack } from "@chakra-ui/react";

export default function Paginacion({ totalPaginas, paginaActual, setPaginaActual }) {
  return (
    <HStack spacing={2} justify="center" mt={4}>
      {[...Array(totalPaginas).keys()].map((n) => (
        <Button
          key={n}
          onClick={() => setPaginaActual(n + 1)}
          colorScheme={n + 1 === paginaActual ? "blue" : "gray"}
        >
          {n + 1}
        </Button>
      ))}
    </HStack>
  );
}