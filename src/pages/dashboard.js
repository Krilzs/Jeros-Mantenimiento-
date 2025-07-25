import DonutCharts from "@/components/dashboard/DonutInformation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useUser } from "@/context/UserContext";
import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  return (
    <DashboardLayout>
      <Heading color="green.700" mb={4}>
        Panel Principal
      </Heading>
      <Text color="gray.600">
        Acá vas a ver un resumen general de tus cobros, gastos y más.
      </Text>
      <DonutCharts />

    </DashboardLayout>
  );
}
