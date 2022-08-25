import { useContext } from "react";
import { UpdateContext } from "./context";

export const useUpdate = () => {
  const context = useContext(UpdateContext);

  if (!context) {
    throw new Error("You forgot to use UpdateProvider");
  }

  return context;
};
