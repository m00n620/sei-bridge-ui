import classNames from "classnames";
import React from "react";

type IButtonType = "default" | "error";

type IButtonProps = {
  type?: IButtonType;
  icon?: string;
  text: string;
  onClick?: () => void;
};

export default function Button({
  type = "default",
  icon,
  text,
  onClick,
}: IButtonProps) {
  return (
    <button
      className={classNames(
        "text-white px-4 py-3 rounded-xl w-full flex items-center justify-center",
        {
          "bg-indigo-500 hover:bg-indigo-600": type === "default",
          "bg-red-500 hover:bg-red-600": type === "error",
        }
      )}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {icon && <img alt="icon" src={icon} className="w-8 h-8 mr-2" />}
      <span className="font-bold">{text}</span>
    </button>
  );
}
