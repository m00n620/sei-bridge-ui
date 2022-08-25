import { useContext } from "react";
import { KeplrContext } from "./context";

export const useKeplr = () => {
  const context = useContext(KeplrContext);

  if (!context) {
    throw new Error("You forgot to use KeplrProvider");
  }

  return context;
};
