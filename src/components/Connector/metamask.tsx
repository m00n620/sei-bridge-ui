import MetamaskLogo from "assets/metamask-logo.png";
import Button from "components/Button";
import React from "react";
import { shortenAddress } from "utils";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

export const MetamaskConnector = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Button
        text="Connect Metamask"
        icon={MetamaskLogo}
        onClick={() => connect({ connector: connectors[0] })}
      />
    );
  }
  if (chain?.unsupported) {
    return (
      <Button
        type="error"
        text="Switch To Ropsten"
        icon={MetamaskLogo}
        onClick={() => switchNetwork?.(3)}
      ></Button>
    );
  }

  return (
    <div className="rounded-xl border border-slate-500 px-4 py-2 flex justify-between items-center">
      <span className="font-bold text-md">{shortenAddress(address)}</span>
      <button
        className="text-sm font-bold p-2 text-white bg-red-500 rounded-md"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
};
