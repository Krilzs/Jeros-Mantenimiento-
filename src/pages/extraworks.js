import DashboardLayout from "@/components/layout/DashboardLayout";
import { Heading, Text } from "@chakra-ui/react";
import TrabajosExtrasPage from "@/components/extraworks/ExtraWorkTable";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Extras() {
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
        Trabajos Extra
      </Heading>
      <Text color="gray.600">
        Vista general de los trabajos extra realizados.
      </Text>
      <TrabajosExtrasPage />
    </DashboardLayout>
  );
}
