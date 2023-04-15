import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { SdkLayout } from "@/components/SdkProvider";
import { MetaMaskProvider } from "@/hooks/useMetamaskOld";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  LivepeerConfig,
  ThemeConfig as LivepeerThemeConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { useMemo } from "react";

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
      blue: "#3abff8",
    },
  },
});

const desiredChainId = ChainId.Mumbai;
const queryClient = new QueryClient();

// Livepeer stuff
const livepeerTheme: LivepeerThemeConfig = {
  colors: {
    accent: "rgb(0, 145, 255)",
    containerBorderColor: "rgba(0, 145, 255, 0.9)",
  },
  fonts: {
    display: "Inter",
  },
};

const livepeerKey = "567b25c3-5ee2-4889-b3d0-ed04467dfa1a";

export default function App({ Component, pageProps }: AppProps) {
  const liverpeerClient = useMemo(
    () =>
      createReactClient({
        provider: studioProvider({
          apiKey: "567b25c3-5ee2-4889-b3d0-ed04467dfa1a",
        }),
      }),
    []
  );

  return (
    <MetaMaskProvider>
      <ThirdwebProvider activeChain={desiredChainId}>
        <QueryClientProvider client={queryClient}>
          <SdkLayout>
            <ChakraProvider resetCSS theme={chakraTheme}>
              <LivepeerConfig
                client={liverpeerClient}
                theme={livepeerTheme}
                dehydratedState={pageProps?.dehydratedState}
              >
                <Component {...pageProps} />
              </LivepeerConfig>
            </ChakraProvider>
          </SdkLayout>
        </QueryClientProvider>
      </ThirdwebProvider>
    </MetaMaskProvider>
  );
}
