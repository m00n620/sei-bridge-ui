import Bridge from "components/Bridge";
import { KeplrProvider } from "hooks/use-keplr";
import { UpdateProvider } from "hooks/use-update";
import React from "react";
import { configureChains, chain, createClient, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.ropsten],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <KeplrProvider>
        <UpdateProvider>
          <Bridge />
        </UpdateProvider>
      </KeplrProvider>
    </WagmiConfig>
  );
}

export default App;
