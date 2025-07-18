import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "@/utils/lib/supabaseClient";

export default function CreateClientModal({
  isOpen,
  onClose,
  onClientCreated,
}) {
  const [nombre, setNombre] = useState("");
  const [lote, setNumeroLote] = useState("");
  const [montoMensual, setMontoMensual] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCreate = async () => {
    if (!nombre || !lote || !montoMensual) {
      toast({
        title: "Todos los campos son obligatorios.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const { data } = await supabase.auth.getSession();

    const token = data.session?.access_token;

    try {
      const res = await fetch("/api/clients/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          nombre,
          lote,
          montoMensual,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al crear cliente");

      toast({
        title: "Cliente creado",
        description: `${nombre} fue agregado correctamente.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Limpia y cierra
      setNombre("");
      setNumeroLote("");
      setMontoMensual("");
      onClose();

      // Avisar al padre

      onClientCreated(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nuevo Cliente</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                placeholder="Ej: Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Número de Lote</FormLabel>
              <Input
                placeholder="Ej: 34B"
                value={lote}
                onChange={(e) => setNumeroLote(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Monto mensual ($)</FormLabel>
              <Input
                type="number"
                placeholder="Ej: 10000"
                value={montoMensual}
                onChange={(e) => setMontoMensual(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button
            colorScheme="green"
            isLoading={loading}
            onClick={handleCreate}
          >
            Crear Cliente
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
