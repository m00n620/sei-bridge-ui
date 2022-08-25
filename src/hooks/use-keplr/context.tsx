import { OfflineSigner } from "@cosmjs/proto-signing";
import { Key } from "@keplr-wallet/types";
import { SEI_TESTNET_CONFIG } from "config";
import React, { createContext, useCallback, useEffect, useState } from "react";

export const KeplrContext = createContext<{
  connect(): Promise<any>;
  account: Key | undefined;
  signer: OfflineSigner | undefined;
} | null>(null);

export const KeplrProvider: React.FC<{ children: any }> = ({ children }) => {
  const [account, setAccount] = useState<Key | undefined>();
  const [signer, setSigner] = useState<OfflineSigner | undefined>();

  const connectKeplr = useCallback(async () => {
    if (!window.getOfflineSigner || !window.keplr) {
      return;
    }
    if (!window.keplr.experimentalSuggestChain) {
      alert(
        "Please use latest version of the Keplr extension to access experimental features"
      );
      return;
    }

    try {
      const { chainId, prefix, chainName, rpcUrl, restUrl } =
        SEI_TESTNET_CONFIG;

      await window.keplr.experimentalSuggestChain({
        chainId,
        chainName,
        rpc: rpcUrl,
        rest: restUrl,
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: prefix,
          bech32PrefixAccPub: `${prefix}pub`,
          bech32PrefixValAddr: `${prefix}valoper`,
          bech32PrefixValPub: `${prefix}valoperpub`,
          bech32PrefixConsAddr: `${prefix}valcons`,
          bech32PrefixConsPub: `${prefix}valconspub`,
        },
        currencies: [
          {
            coinDenom: "SEI",
            coinMinimalDenom: "usei",
            coinDecimals: 6,
          },
          {
            coinDenom: "USDC",
            coinMinimalDenom: "uusdc",
            coinDecimals: 6,
            coinGeckoId: "usd-coin",
          },
          {
            coinDenom: "ATOM",
            coinMinimalDenom: "uatom",
            coinDecimals: 6,
            coinGeckoId: "cosmos",
          },
          {
            coinDenom: "WETH",
            coinMinimalDenom:
              "ibc/C2A89D98873BB55B62CE86700DFACA646EC80352E8D03CC6CF34DD44E46DC75D",
            coinDecimals: 18,
            coinGeckoId: "weth",
          },
          {
            coinDenom: "WBTC",
            coinMinimalDenom:
              "ibc/42BCC21A2B784E813F8878739FD32B4AA2D0A68CAD94F4C88B9EA98609AB0CCD",
            coinDecimals: 8,
            coinGeckoId: "bitcoin",
          },
          {
            coinDenom: "aUSDC",
            coinMinimalDenom:
              "ibc/6D45A5CD1AADE4B527E459025AC1A5AEF41AE99091EF3069F3FEAACAFCECCD21",
            coinDecimals: 6,
            coinGeckoId: "usd-coin",
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "SEI",
            coinMinimalDenom: "usei",
            coinDecimals: 6,
          },
        ],
        stakeCurrency: {
          coinDenom: "SEI",
          coinMinimalDenom: "usei",
          coinDecimals: 6,
        },
        coinType: 118,
        features: ["stargate", "ibc-transfer", "cosmwasm"],
      });

      await window.keplr.enable(chainId);

      const account = await window.keplr.getKey(chainId);

      const sendingSigner = await window.keplr.getOfflineSigner(chainId);
      if (!sendingSigner)
        throw new Error(`Failed to get sendingSigner for ${chainId}`);

      setAccount(account);
      setSigner(sendingSigner);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    connectKeplr();
  }, [connectKeplr]);

  return (
    <KeplrContext.Provider value={{ connect: connectKeplr, account, signer }}>
      {children}
    </KeplrContext.Provider>
  );
};
