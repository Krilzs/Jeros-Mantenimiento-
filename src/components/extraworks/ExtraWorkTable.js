import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Text,
  Select,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { getData } from "@/utils/utils";
import { supabase } from "@/utils/lib/supabaseClient";
import { AddIcon } from "@chakra-ui/icons";
import LoadingScreen from "../LoadingScreen";
import { useEffect, useState } from "react";

export default function TrabajosExtrasPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [form, setForm] = useState({
    cliente_id: "",
    descripcion: "",
    monto_cobrado: "",
    fecha: "",
  });
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrabajos = async () => {
    try {
      const token = await getData(supabase);
      const res = await fetch("/api/extraworks/get-all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      setTrabajos(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrabajos();
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const token = await getData(supabase);

      const res = await fetch("/api/clients/get", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          credentials: "include",
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener clientes");
      }

      const data = await res.json();

      setClientes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!form.descripcion || !form.monto_cobrado || !form.fecha) {
      toast({
        title: "Error",
        description: "Por favor completá todos los campos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    try {
      const token = await getData(supabase);

      const res = await fetch("/api/extraworks/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        return;
      }
      toast({
        title: "Éxito",
        description: "Trabajo extra agregado con éxito.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setForm({
        descripcion: "",
        monto_cobrado: "",
        fecha: "",
      });
      onClose();
      setError(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el trabajo extra.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
    }
  };
  if (loading) {
    return <LoadingScreen fullscreen={false} />;
  }

  return (
    <Box px={6} py={8} bg="gray.50" minH="100vh">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Heading size="lg" color="brand.800">
          Trabajos Extras
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          color="brand.800"
          onClick={onOpen}
          backgroundColor={"brand.100"}
          borderRadius="xl"
        >
          Agregar trabajo extra
        </Button>
      </Box>

      <TableContainer bg="white" borderRadius="xl" shadow="md">
        <Table variant="simple">
          <Thead bg="primary.100">
            <Tr>
              <Th color="primary.800">Cliente</Th>
              <Th color="primary.800">Lote</Th>
              <Th color="primary.800">Descripción</Th>
              <Th color="primary.800">Monto cobrado</Th>
              <Th color="primary.800">Fecha</Th>
            </Tr>
          </Thead>
          <Tbody>
            {trabajos
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((trabajo) => (
                <Tr key={trabajo.id} _hover={{ bg: "gray.50" }}>
                  <Td>{trabajo.cliente}</Td>
                  <Td>{trabajo.lote}</Td>
                  <Td>{trabajo.descripcion}</Td>
                  <Td>${trabajo.monto_cobrado.toLocaleString()}</Td>
                  <Td>{trabajo.fecha.split("-").reverse().join("/")}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal para agregar trabajo */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader _disabled={!form.cliente_id} color="brand">
            Nuevo trabajo extra
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Cliente</FormLabel>
                <Select
                  value={form.cliente_id}
                  onChange={(e) =>
                    setForm({ ...form, cliente_id: e.target.value })
                  }
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Text color="red.500">{error}</Text>
                <Input
                  placeholder="Ej: Limpieza de motor"
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Monto cobrado</FormLabel>
                <Input
                  type="number"
                  placeholder="Ej: 10000"
                  value={form.monto_cobrado}
                  onChange={(e) =>
                    setForm({ ...form, monto_cobrado: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <Input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="teal" onClick={() => handleSubmit(form)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
