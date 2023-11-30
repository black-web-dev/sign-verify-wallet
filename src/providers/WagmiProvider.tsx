import React from "react";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

type WagmiProviderType = {
  children: React.ReactNode;
};

const cascadia = {
  id: 6102,
  name: "Cascadia",
  network: "cascadia",
  iconUrl: "/images/tokens/cascadia.jpg",
  iconBackground: "transparent",
  nativeCurrency: {
    decimals: 18,
    name: "cascadia",
    symbol: "TCC",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.cascadia.foundation"],
    },
    public: {
      http: ["https://testnet.cascadia.foundation"],
    },
  },
  blockExplorers: {
    default: {
      name: "Cascadia Explorer",
      url: "https://explorer.cascadia.foundation/",
    },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [cascadia],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
});

const WagmiProvider = ({ children }: WagmiProviderType) => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </>
  );
};

export default WagmiProvider;
