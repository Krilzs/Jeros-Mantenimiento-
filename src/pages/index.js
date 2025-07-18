import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading]);

  if (loading) return <LoadingScreen fullscreen={true} />;

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(to-br, green.100, green.300, green.500)"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        maxW="md"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Heading
            as="h1"
            size="2xl"
            color="brand.600"
            fontWeight="bold"
            lineHeight="shorter"
          >
            Jeros Mantenimiento
          </Heading>

          <Text fontSize="lg" color="gray.700">
            Administrá tus clientes, cobros, gastos y trabajos extra desde un
            solo lugar.
          </Text>

          <VStack spacing={4} width="100%">
            <Button
              size="lg"
              colorScheme="green"
              width="100%"
              onClick={() => router.push("/login")}
            >
              Iniciar sesión
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="green"
              width="100%"
              onClick={() => router.push("/register")}
            >
              Registrarse
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
