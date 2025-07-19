import { Box, Button } from "@chakra-ui/react";

export default function Actions({ openModal, openHistoryModal }) {
  return (
    <Box display="flex" justifyContent="start" width={"100%"} gap={2}>
      <Button colorScheme="blue" onClick={openModal} mb={4}>
        Nuevo Movimiento
      </Button>
      <Button
        variant={"outline"}
        colorScheme="blue"
        onClick={openHistoryModal}
        mb={4}
      >
        Ver Historial en calendario
      </Button>
    </Box>
  );
}
