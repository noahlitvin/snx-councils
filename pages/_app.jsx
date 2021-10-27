import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import Fonts from "../components/Fonts";
import Layout from "../components/layout";
import theme from "../styles/theme";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Fonts />
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
export default MyApp;
