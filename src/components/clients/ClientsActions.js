import {
  Box,
  Button,
  Input,
  HStack,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon, EditIcon } from "@chakra-ui/icons";
import CreateClientModal from "./CreateClientModal";
import EditMultipleModal from "./EditMultipleModal";

export default function ClientsActions({
  onSearch,
  onClientCreated,
  seleccionados,
  clientes,
  onGuardarMultiples,
}) {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  return (
    <Box mb={4}>
      <HStack spacing={4} justify="space-between" flexWrap="wrap">
        {/* Buscar por nombre */}
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <Icon as={SearchIcon} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar cliente..."
            onChange={(e) => onSearch(e.target.value)}
            focusBorderColor="green.500"
          />
        </InputGroup>

        <HStack spacing={3}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            onClick={onCreateOpen}
            bg="green.500"
            _hover={{ bg: "green.600" }}
          >
            Nuevo Cliente
          </Button>

          <Button
            leftIcon={<EditIcon />}
            colorScheme="blue"
            onClick={onEditOpen}
            isDisabled={seleccionados.length === 0}
          >
            Editar montos en lote
          </Button>
        </HStack>
      </HStack>

      <CreateClientModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onClientCreated={onClientCreated}
      />

      <EditMultipleModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        clientes={clientes.filter((c) => seleccionados.includes(c.id))}
        onGuardar={onGuardarMultiples}
      />
    </Box>
  );
}
