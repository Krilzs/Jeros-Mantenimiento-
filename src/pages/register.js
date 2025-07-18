import { useState } from "react";
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

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(translateError(signUpError.message));
      return;
    }

    setSuccess(true);
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
        Crear cuenta
      </Heading>

      <VStack spacing="4">
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {success && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            Te registraste correctamente. Revisá tu correo para confirmar la
            cuenta.
          </Alert>
        )}

        {!success && (
          <>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                focusBorderColor="brand.500"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                focusBorderColor="brand.500"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                focusBorderColor="brand.500"
              />
            </FormControl>

            <Button
              colorScheme="green"
              width="full"
              onClick={handleRegister}
              bg="brand.500"
              _hover={{ bg: "brand.600" }}
            >
              Registrarse
            </Button>
          </>
        )}

        <Text fontSize="sm">
          {!success && "Ya tenés una cuenta?"}
          {success && "Una vez confirmado podras "}
          <Link color="brand.600" href="/login">
            Iniciar sesión
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}
