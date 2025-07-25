import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {} from "@chakra-ui/react";
import { getData } from "@/utils/utils";
import { supabase } from "@/utils/lib/supabaseClient";

const AddNewMonth = ({ cliente, onClose }) => {
  const [form, setForm] = useState({
    tipo: "cobro",
    cliente_id: cliente?.id || "",
    monto: "",
    fecha: "",
    mes_asignado: "",
  });

  const toast = useToast();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const setFormType = (type) => {
    setForm({ ...form, tipo: type });
  };

  const handleSubmit = async () => {
    const endpoint =
      form.tipo === "cobro"
        ? "/api/payments/registerMonthPay"
        : "/api/payments/registerMonthDebt";

    const token = await getData(supabase);

    if (!form.mes_asignado || !form.fecha || !form.monto)
      return toast({
        title: "Error al guardar el movimiento",
        description: "Faltan campos obligatorios",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(res.error || "Error desconocido");

      toast({
        title: "Movimiento registrado",
        description: "Se registró el movimiento correctamente",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error al guardar el movimiento",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registrar movimiento</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab color={"brand.800"} onClick={() => setFormType("cobro")}>
                COBRO
              </Tab>
              <Tab color={"red.500"} onClick={() => setFormType("deuda")}>
                DEUDA
              </Tab>
            </TabList>

            <TabPanels>
              {/* COBRO */}
              <TabPanel>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Mes asignado</FormLabel>
                    <Input
                      type="date"
                      name="mes_asignado"
                      value={form.mes_asignado}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Fecha de Pago</FormLabel>
                    <Input
                      type="date"
                      name="fecha"
                      value={form.fecha}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Monto pagado</FormLabel>
                    <Input
                      type="number"
                      name="monto"
                      value={form.monto}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* DEUDA */}
              <TabPanel>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Mes Adeudado</FormLabel>
                    <Input
                      type="date"
                      name="mes_asignado"
                      value={form.mes_asignado}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Fecha de registro</FormLabel>
                    <Input
                      type="date"
                      name="fecha"
                      value={form.fecha}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Monto pagado</FormLabel>
                    <Input
                      type="number"
                      name="monto"
                      value={form.monto}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddNewMonth;
