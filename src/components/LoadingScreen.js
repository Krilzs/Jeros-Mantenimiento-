import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function LoadingScreen({ fullscreen }) {
  return (
    <Box
      bg="white"
      height={fullscreen ? "100vh" : "auto"}
      width={fullscreen ? "100vw" : "auto"}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <MotionBox
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="green.400" thickness="4px" speed="0.8s" />
          <Text fontSize="lg" fontWeight="medium" color="green.700">
            Cargando tu experiencia...
          </Text>
        </VStack>
      </MotionBox>
    </Box>
  );
}
