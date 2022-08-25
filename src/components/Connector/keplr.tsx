import KeplrLogo from "assets/keplr-logo.png";
import Button from "components/Button";
import { useKeplr } from "hooks/use-keplr";
import React from "react";
import { shortenBech32Address } from "utils";

export const KeplrConnector = () => {
  const { connect, account } = useKeplr();

  if (account === undefined) {
    return (
      <Button text="Connect Keplr" icon={KeplrLogo} onClick={() => connect()} />
    );
  }

  return (
    <div className="rounded-xl border border-slate-500 px-4 py-2">
      <p className="font-bold text-lg">{account.name}</p>
      <p className="text-sm">{shortenBech32Address(account.bech32Address)}</p>
    </div>
  );
};
