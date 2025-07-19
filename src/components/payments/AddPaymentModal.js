import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";

export default function AddModal({
  isModalOpen,
  closeModal,
  form,
  setForm,
  clientes,
  handleSubmit,
}) {
  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registrar Movimiento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Tipo</FormLabel>
            <Select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <option value="cobro">Cobro</option>
              <option value="gasto">Gasto</option>
            </Select>
          </FormControl>
          {form.tipo === "cobro" && (
            <>
              <FormControl mb={3}>
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

              <FormControl display="flex" alignItems="center" mb={3}>
                <Checkbox
                  isChecked={form.asignarMensualidad}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      asignarMensualidad: e.target.checked,
                    })
                  }
                  mr={2}
                />
                <FormLabel mb={0}>Asignar a mensualidad</FormLabel>
              </FormControl>

              {form.asignarMensualidad && (
                <FormControl mb={3}>
                  <FormLabel>Mes del corte (YYYY-MM)</FormLabel>
                  <Input
                    type="month"
                    value={form.mes_asignado || ""}
                    onChange={(e) =>
                      setForm({ ...form, mes_asignado: e.target.value })
                    }
                  />
                </FormControl>
              )}
            </>
          )}
          {form.tipo === "gasto" && (
            <FormControl mb={3}>
              <FormLabel>Nombre de gasto</FormLabel>
              <Input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </FormControl>
          )}
          <FormControl mb={3}>
            <FormLabel>Monto</FormLabel>

            <Input
              type="number"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Fecha de realizacion</FormLabel>
            <Input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Guardar
          </Button>
          <Button onClick={closeModal}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
