import React from "react";
import TokenSelect from "components/TokenSelect";

export default function TokenInput({
  value = 0,
  readOnly = false,
  onChange,
}: {
  value?: number;
  readOnly?: boolean;
  onChange?: (val: string) => void;
}) {
  return (
    <div className="h-16 flex space-x-2">
      <div className="flex flex-grow w-full h-16 border pl-4 pr-4 py-2 rounded-xl bg-gray-50 border-gray-100">
        <div className="flex-1 ml-auto mr-2">
          <input
            type="number"
            className="focus:outline-none bg-transparent h-full font-mono min-w-[300px] flex-grow"
            placeholder="0.0"
            readOnly={readOnly}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
        <TokenSelect />
      </div>
    </div>
  );
}
