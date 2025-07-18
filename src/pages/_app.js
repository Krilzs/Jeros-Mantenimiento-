import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/theme";
import { UserProvider } from "../context/UserContext";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  );
}

export default MyApp;
