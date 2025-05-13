import React from "react";
import { NavLink } from "react-router-dom";

interface WhiteButtonProps {
  link?: string;
  text: string;
  width: string;
  py: string;
  textSize: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const WhiteButton: React.FC<WhiteButtonProps> = ({
  link,
  text,
  width,
  py,
  textSize,
  onClick,
  children,
  className = "",
}) => {
  const buttonClass = `dark:bg-whiteSecondary bg-blackPrimary w-${width} py-${py} text-${textSize} dark:hover:bg-white hover:bg-gray-800 bg-blackPrimary duration-200 flex items-center justify-center gap-x-2 ${className}`;

  if (link) {
    return (
      <NavLink
        to={link}
        className={buttonClass}
      >
        {children}
        <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
          {text}
        </span>
      </NavLink>
    );
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={buttonClass}
    >
      {children}
      <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
        {text}
      </span>
    </button>
  );
};

export default WhiteButton;
