import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "One Balance",
  projectId: "f9a618ca162f4b550a1489fa383f08ab",
  chains: [mainnet],
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme accentColor="blue" appearance="dark">
      <WagmiProvider config={config}>
        <QueryClientProvider client={new QueryClient()}>
          <RainbowKitProvider>
            <App />
            {/* Your App */}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Theme>
  </StrictMode>
);
