import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaUser, FaMoneyBill, FaWrench, FaChartLine } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { supabase } from "@/utils/lib/supabaseClient";
const SidebarLink = ({ label, icon, href, activateFunction }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <HStack
      as="button"
      onClick={href ? () => router.push(href) : activateFunction}
      spacing={3}
      px={4}
      py={2}
      w="full"
      borderRadius="md"
      bg={isActive ? "green.100" : "transparent"}
      _hover={{ bg: "green.50" }}
      transition="0.2s"
    >
      <Box as={icon} color="green.600" />
      <Text fontWeight="medium" color="gray.700">
        {label}
      </Text>
    </HStack>
  );
};

export default function DashboardLayout({ children }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error cerrando sesión:", error.message);
    } else {
      // Opcional: redirigir a login u otra página
      window.location.href = "/login";
    }
  };
  return (
    <Flex minH="100vh">
      <Box
        w="250px"
        bg="green.50"
        p={5}
        borderRight="1px solid"
        borderColor="gray.100"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} color="green.700">
          Panel de Administracion
        </Text>
        <VStack align="start" spacing={3}>
          <SidebarLink
            label="Panel General"
            icon={FaChartLine}
            href="/dashboard"
          />
          <SidebarLink label="Clientes" icon={FaUser} href="/clientes" />
          <SidebarLink
            label="Cobros y Gastos"
            icon={FaMoneyBill}
            href="/pagos"
          />
          <SidebarLink
            label="Trabajos Extra"
            icon={FaWrench}
            href="/extraworks"
          />
          <SidebarLink
            label="Cerrar Sesion"
            icon={TbLogout2}
            activateFunction={handleLogout}
          />
        </VStack>
      </Box>

      {/* Main content */}
      <Box flex={1} bg="white" p={6}>
        {children}
      </Box>
    </Flex>
  );
}
