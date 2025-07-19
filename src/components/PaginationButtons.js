import { Box, Button, Text } from "@chakra-ui/react";

export default function PaginationButtons({
  paginaActual,
  totalPaginas,
  setPaginaActual,
}) {
  return (
    <Box mt={4} display="flex" justifyContent="center" gap={2}>
      <Button
        size={"sm"}
        colorScheme={paginaActual === 1 ? "gray" : "brand"}
        onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
        isDisabled={paginaActual === 1}
      >
        Anterior
      </Button>
      <Text px={2} display={"flex"} justifyContent="center" align="center">
        Página {paginaActual} de {totalPaginas}
      </Text>
      <Button
        size={"sm"}
        colorScheme={paginaActual === totalPaginas ? "gray" : "brand"}
        onClick={() =>
          setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
        }
        isDisabled={paginaActual === totalPaginas}
      >
        Siguiente
      </Button>
    </Box>
  );
}
