import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  Text,
  Link,
} from "@chakra-ui/react";
import { supabase } from "../utils/lib/supabaseClient";
import { useRouter } from "next/router";
import { translateError } from "@/utils/lib/errors";
import { useUser } from "@/context/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading]);

  const handleLogin = async () => {
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(translateError(error.message));
      return;
    }

    router.push("/"); // redirigí a donde quieras
  };

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt="100px"
      p="8"
      boxShadow="md"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
    >
      <Heading textAlign="center" size="lg" mb="6" color="brand.600">
        Iniciar sesión
      </Heading>

      <VStack spacing="4">
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            focusBorderColor="brand.500"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Contraseña</FormLabel>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            focusBorderColor="brand.500"
          />
        </FormControl>

        <Button
          colorScheme="green"
          width="full"
          onClick={handleLogin}
          bg="brand.500"
          _hover={{ bg: "brand.600" }}
        >
          Ingresar
        </Button>

        <Text fontSize="sm">
          ¿No tenés cuenta?{" "}
          <Link color="brand.600" href="/register">
            Registrate
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}
