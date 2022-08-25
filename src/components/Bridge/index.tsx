import IERC20ABI from "abis/IERC20.json";
import IAxelarGatewayABI from "abis/IAxelarGateway.json";
import classNames from "classnames";
import { MetamaskConnector, KeplrConnector } from "components/Connector";
import TokenInput from "components/TokenInput";
import { AUSDC_ADDRESS, GATEWAY_ADDRESS, SEI_TESTNET_CONFIG } from "config";
import { ethers } from "ethers";
import { useERC20Balance } from "hooks/use-erc20-balance";
import { useKeplr } from "hooks/use-keplr";
import { useSeiBalance } from "hooks/use-sei-balance";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { useUpdate } from "hooks/use-update";

export default function Bridge() {
  const metamaskAccount = useAccount();
  const { data: signer } = useSigner();
  const { account: keplrAccount } = useKeplr();
  const { update } = useUpdate();

  const [inputAmount, setInputAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const ropstenBalance = useERC20Balance(AUSDC_ADDRESS);
  const seiBalance = useSeiBalance("aUSDC");

  const handleBridge = async () => {
    if (!signer || !keplrAccount || !ropstenBalance) return;

    setIsLoading(true);
    try {
      const tokenContract = new ethers.Contract(
        AUSDC_ADDRESS,
        IERC20ABI,
        signer
      );
      const gatewayContract = new ethers.Contract(
        GATEWAY_ADDRESS,
        IAxelarGatewayABI,
        signer
      );
      const amount = ethers.utils.parseUnits(
        inputAmount.toString(),
        ropstenBalance.decimals
      );
      const approveTx = await tokenContract.approve(GATEWAY_ADDRESS, amount);
      console.log(await approveTx.wait());

      const sendTx = await gatewayContract.sendToken(
        SEI_TESTNET_CONFIG.chainId,
        keplrAccount.bech32Address,
        "aUSDC",
        amount
      );

      console.log(await sendTx.wait());

      update();
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 gap-6 justify-center py-16 px-8">
        <div className="pb-3 place-self-center">
          <div className="grid grid-cols-2 gap-3 my-4">
            <MetamaskConnector />
            <KeplrConnector />
          </div>
          <div className="bg-white shadow-lg pt-3 px-6 pb-6 rounded-2xl transform transition-all duration-100 shadow-indigo-xl mb-6">
            <div className="grid grid-cols-1 gap-4 place-content-center">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">
                    From <strong>Ropsten</strong>
                  </span>
                  {ropstenBalance && (
                    <span className="text-sm">
                      {ropstenBalance.formatted} {ropstenBalance.symbol}
                    </span>
                  )}
                </div>
                <TokenInput
                  value={inputAmount}
                  onChange={(val) => setInputAmount(Number(val))}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">
                    To <strong>SEI Testnet</strong>
                  </span>
                  {seiBalance && (
                    <span className="text-sm">
                      {seiBalance.amount} {seiBalance.denom}
                    </span>
                  )}
                </div>
                <TokenInput readOnly value={inputAmount} />
              </div>
            </div>
            <div className="py-2">
              <button
                type="button"
                disabled={
                  inputAmount <= 0 ||
                  inputAmount > Number(ropstenBalance?.formatted) ||
                  metamaskAccount.isDisconnected ||
                  keplrAccount === undefined ||
                  isLoading
                }
                className={classNames(
                  `
                  inline-flex justify-center items-center
                  cursor-pointer text-white font-bold text-lg px-4 py-3 my-2 rounded-xl w-full
                  bg-gradient-to-r from-purple-600 to-blue-600
                  hover:from-purple-700 hover:to-blue-700
                  disabled:from-gray-300 disabled:to-gray-200 disabled:cursor-not-allowed
                `,
                  { "!from-purple-300 !to-blue-300": isLoading }
                )}
                onClick={handleBridge}
              >
                {isLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {metamaskAccount.isDisconnected || keplrAccount === undefined
                  ? "Connect Wallets"
                  : inputAmount > Number(ropstenBalance?.formatted)
                  ? "Insufficient aUSDC balance"
                  : inputAmount <= 0
                  ? "Enter an amount"
                  : "Bridge Token"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
