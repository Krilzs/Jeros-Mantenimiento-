import DashboardLayout from "@/components/layout/DashboardLayout";
import { Heading, Text } from "@chakra-ui/react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Heading color="green.700" mb={4}>
        Panel Principal
      </Heading>
      <Text color="gray.600">
        Acá vas a ver un resumen general de tus cobros, gastos y más.
      </Text>
    </DashboardLayout>
  );
}
