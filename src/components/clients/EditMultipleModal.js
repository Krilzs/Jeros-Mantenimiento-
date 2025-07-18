import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export default function EditMultipleModal({
  isOpen,
  onClose,
  clientes,
  onGuardar,
}) {
  const [porcentaje, setPorcentaje] = useState("");
  const [monto, setMonto] = useState("");

  const handleAplicar = () => {
    const incPorc = porcentaje ? parseFloat(porcentaje) : 0;
    const incMonto = monto ? parseFloat(monto) : 0;

    if (isNaN(incPorc) && isNaN(incMonto)) return;

    const actualizados = clientes.map((c) => {
      let nuevoMonto = c.monto_mensual;
      if (incPorc) nuevoMonto += (nuevoMonto * incPorc) / 100;
      if (incMonto) nuevoMonto += incMonto;
      return { ...c, monto_mensual: Math.round(nuevoMonto) };
    });

    onGuardar(actualizados);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar múltiples clientes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <Text>Cantidad seleccionada: {clientes.length}</Text>
            <Input
              placeholder="Aumentar porcentaje (%)"
              type="number"
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
            />
            <Input
              placeholder="Aumentar monto ($)"
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleAplicar}>
            Aplicar cambios
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
