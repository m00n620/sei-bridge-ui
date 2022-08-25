import React, { createContext, useState } from "react";

export const UpdateContext = createContext<{
  value: number;
  update: () => void;
} | null>(null);

export const UpdateProvider: React.FC<{ children: any }> = ({ children }) => {
  const [updateValue, setUpdateValue] = useState(0);

  const update = () => setUpdateValue(updateValue + 1);

  return (
    <UpdateContext.Provider value={{ value: updateValue, update }}>
      {children}
    </UpdateContext.Provider>
  );
};
