import React from "react";

const USDC_LOGO_URL =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png";

export default function TokenInput() {
  return (
    <div className="flex rounded-xl py-2">
      <div className="mr-4 flex-shrink-0 self-center hidden sm:block">
        <img alt='logo' src={USDC_LOGO_URL} className="w-8 h-8 rounded-md" />
      </div>
      <h4 className="text-lg font-medium">aUSDC</h4>
    </div>
  );
}
