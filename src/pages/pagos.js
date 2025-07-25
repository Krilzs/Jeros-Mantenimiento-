import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Heading,
  Checkbox,
} from "@chakra-ui/react";
import ModalHistorial from "../components/payments/HistoryPaymentsModal";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getData } from "@/utils/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/lib/supabaseClient";
import LoadingScreen from "@/components/LoadingScreen";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import Balance from "@/components/payments/Balance";
import Actions from "@/components/payments/PaymentActions";
import PrincipalTable from "@/components/payments/PrincipalTable";
import PaginationButtons from "@/components/PaginationButtons";
import AddModal from "@/components/payments/AddPaymentModal";

export default function Pagos() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const {
    isOpen: isHistoryOpen,
    onOpen: openHistoryModal,
    onClose: closeHistoryModal,
  } = useDisclosure();
  const [pagos, setPagos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loadingPage, setLoading] = useState(true);

  const [form, setForm] = useState({
    tipo: "cobro",
    nombre: "",
    cliente_id: "",
    monto: "",
    fecha: "",
    asignarMensualidad: false,
    mes_asignado: "",
  });

  const toast = useToast();

  console.log(gastos);
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchPagos();
    fetchGastos();
    fetchClientes();
  }, []);

  const checkLoading = () => {
    if (!pagos || !gastos || !clientes) setLoading(true);
    else setLoading(false);
  };

  const resetForm = () => {
    setForm({
      tipo: "cobro",
      nombre: "",
      cliente_id: "",
      monto: "",
      fecha: "",
      asignarMensualidad: false,
      mes_asignado: "",
    });
  };

  const movimientos = [
    ...pagos.map((p) => ({
      id: p.id,
      tipo: "cobro",
      fecha: p.fecha_pago,
      nombre: p.cliente?.nombre || "—",
      monto: p.monto_pagado,
    })),
    ...gastos.map((g) => ({
      id: g.id,
      tipo: "gasto",
      fecha: g.fecha,
      nombre: g.nombre,
      monto: g.monto,
    })),
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const ingresos = movimientos
    .filter((m) => m.tipo === "cobro")
    .reduce((acc, m) => acc + m.monto, 0);

  const egresos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + m.monto, 0);

  const balance = ingresos - egresos;

  const movimientosPorPagina = 8;

  const totalPaginas = Math.ceil(movimientos.length / movimientosPorPagina);
  const movimientosVisibles = movimientos.slice(
    (paginaActual - 1) * movimientosPorPagina,
    paginaActual * movimientosPorPagina
  );

  const fetchClientes = async () => {
    const token = await getData(supabase);
    try {
      const res = await fetch("/api/clients/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setClientes(data);
      checkLoading();
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  const fetchPagos = async () => {
    const token = await getData(supabase);
    try {
      const res = await fetch("/api/payments/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      setPagos(data);
      checkLoading();
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
      setPagos([]);
    }
  };

  const fetchGastos = async () => {
    const token = await getData(supabase);
    try {
      const res = await fetch("/api/spent/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setGastos(data);
      checkLoading();
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
      setGastos([]);
    }
  };

  const handleSubmit = async () => {
    const endpoint =
      form.tipo === "cobro" ? "/api/payments/create" : "/api/spent/create";
    const payload =
      form.tipo === "cobro"
        ? {
            cliente_id: form.cliente_id,
            monto_pagado: parseFloat(form.monto),
            fecha_pago: form.fecha,
            mes_asignado: form.asignarMensualidad ? form.mes_asignado : null,
          }
        : {
            monto: parseFloat(form.monto),
            fecha: form.fecha,
            nombre: form.nombre,
          };

    if (!form.cliente_id && form.tipo === "cobro") {
      toast({
        title: "Error al guardar el movimiento",
        description: "Debes seleccionar un cliente",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!form.monto || !form.fecha) {
      toast({
        title: "Error al guardar el movimiento",
        description: "Debes completar todos los campos",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = await getData(supabase);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast({
          title: "Error al guardar el movimiento",
          description: res.statusText,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw new Error("Error al guardar el movimiento");
      }

      closeModal();
      fetchPagos();
      fetchGastos();
      resetForm();

      toast({
        title: "Movimiento guardado",
        description: "Movimiento registrado correctamente",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

    } catch (err) {
      console.error(err);
    }
  };

  if (loadingPage) {
    return (
      <DashboardLayout>
        <Heading color="green.700" mb={5}>
          Pagos y Gastos
        </Heading>
        <Text color="gray.600" mb={40}>
          Resumen general sobre pagos de clientes.
        </Text>
        <LoadingScreen fullscreen={false} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Heading color="green.700" mb={5}>
        Cobros y Gastos
      </Heading>
      <Text color="gray.600">Resumen general sobre pagos de clientes.</Text>
      <Box mx="auto" p={4}>
        <Balance balance={balance} ingresos={ingresos} egresos={egresos} />
        <Actions openModal={openModal} openHistoryModal={openHistoryModal} />
        <ModalHistorial
          isOpen={isHistoryOpen}
          onClose={closeHistoryModal}
          clienteId={form.cliente_id}
        />
        <PrincipalTable movimientosVisibles={movimientosVisibles} />
        <PaginationButtons
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          setPaginaActual={setPaginaActual}
        />

        <AddModal
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          clientes={clientes}
        />
      </Box>
    </DashboardLayout>
  );
}
