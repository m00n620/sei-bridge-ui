import { Coin, SigningStargateClient } from "@cosmjs/stargate";
import { SEI_TESTNET_CONFIG } from "config";
import { useKeplr } from "hooks/use-keplr";
import { useUpdate } from "hooks/use-update";
import { useEffect, useState, useCallback } from "react";

export const useSeiBalance = (denom: string) => {
  const { account, signer } = useKeplr();
  const { value } = useUpdate();
  const [balance, setBalance] = useState<Coin | undefined>();

  const fetchBalance = useCallback(async () => {
    if (!account || !signer) return;

    const cosmJS = await SigningStargateClient.connectWithSigner(
      SEI_TESTNET_CONFIG.rpcUrl,
      signer
    );

    try {
      const balance = await cosmJS.getBalance(account.bech32Address, denom);
      setBalance(balance);
    } catch (e) {
      console.error(e);
    }
  }, [account, denom, signer]);

  useEffect(() => {
    if (account && signer) {
      console.log("refetching...");
      fetchBalance();
    }
  }, [fetchBalance, account, signer, value]);

  return balance;
};
