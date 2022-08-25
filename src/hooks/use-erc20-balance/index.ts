import { useUpdate } from "hooks/use-update";
import { useEffect } from "react";
import { useAccount, useBalance as useWagmiBalance } from "wagmi";

export const useERC20Balance = (tokenAddress: string) => {
  const account = useAccount();
  const { data, refetch } = useWagmiBalance({
    addressOrName: account.address,
    token: tokenAddress,
  });
  const { value } = useUpdate();

  useEffect(() => {
    console.log("refetching...");
    refetch();
  }, [refetch, value]);

  return data;
};
