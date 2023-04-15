import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { SdkLayout } from "@/components/SdkProvider";
import { MetaMaskProvider } from "@/hooks/useMetamaskOld";

const chakraTheme: ThemeConfig = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "#111827",
        overflowX: "hidden",
      },
    },
  },
  fonts: {
    heading: `'Figtree', sans-serif`,
    body: `'Figtree', sans-serif`,
  },
  colors: {
    brand: {
      red: "#dc2626",
      darkBlue: "#0E0D37",
      purple: "#7554FA",
      lightPurple: "#E7CBFD",
      // brightBlue: "#70DFFD",
      brightBlue: "#00c9ff",
      white: "#FAFAFA",
      gray: "#7C7A85",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetaMaskProvider>
      <SdkLayout>
        <ChakraProvider resetCSS theme={chakraTheme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </SdkLayout>
    </MetaMaskProvider>
  );
}
