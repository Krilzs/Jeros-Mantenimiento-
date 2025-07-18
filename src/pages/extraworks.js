import DashboardLayout from "@/components/layout/DashboardLayout";
import { Heading, Text } from "@chakra-ui/react";
import TrabajosExtrasPage from "@/components/extraworks/ExtraWorkTable";

export default function Extras() {

  

  return (
    <DashboardLayout>
      <Heading color="green.700" mb={4}>
        Trabajos Extra
      </Heading>
      <Text color="gray.600">
        Vista general de los trabajos extra realizados.
      </Text>
      <TrabajosExtrasPage />
    </DashboardLayout>
  );
}
