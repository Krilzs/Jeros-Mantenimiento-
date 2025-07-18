import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function EditarMontoModal({ isOpen, onClose, cliente, onSave }) {
  const [nuevoMonto, setNuevoMonto] = useState(cliente.monto_mensual);
  const [porcentaje, setPorcentaje] = useState("");
  const [aumento, setAumento] = useState("");
  const [descuento, setDescuento] = useState("");
  const [manual, setManual] = useState("");

  useEffect(() => {
    if (cliente) {
      setNuevoMonto(cliente.monto_mensual);
    }
  }, [cliente]);

  const aplicarCambios = () => {
    let monto = cliente.monto_mensual;

    if (porcentaje) {
      monto += (monto * parseFloat(porcentaje)) / 100;
    }

    if (aumento) {
      monto += parseFloat(aumento);
    }

    if (descuento) {
      monto -= parseFloat(descuento);
    }

    if (manual) {
      monto = parseFloat(manual);
    }

    setNuevoMonto(Math.round(monto));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar monto de {cliente.nombre}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <Text>Monto actual: ${cliente.monto_mensual}</Text>

            <Input
              placeholder="Aumentar %"
              type="number"
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
            />
            <Input
              placeholder="Aumentar $"
              type="number"
              value={aumento}
              onChange={(e) => setAumento(e.target.value)}
            />
            <Input
              placeholder="Restar $"
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
            />
            <Input
              placeholder="Nuevo monto total"
              type="number"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
            />

            <Button
              colorScheme="gray"
              variant="outline"
              onClick={aplicarCambios}
            >
              Aplicar cambios
            </Button>

            <Text fontSize="md" fontWeight="semibold">
              Monto final: ${nuevoMonto}
            </Text>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={() => onSave(cliente, nuevoMonto)}
          >
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
