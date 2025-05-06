import React from "react";

interface WhiteButtonProps {
  link?: string;
  text: string;
  width: string;
  py: string;
  textSize: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const WhiteButton: React.FC<WhiteButtonProps> = ({
  link,
  text,
  width,
  py,
  textSize,
  onClick,
  children,
}) => {
  if (link) {
    return (
      <a
        href={link}
        className={`dark:bg-whiteSecondary bg-blackPrimary w-${width} py-${py} text-${textSize} dark:hover:bg-white hover:bg-gray-800 bg-blackPrimary duration-200 flex items-center justify-center gap-x-2`}
      >
        {children}
        <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
          {text}
        </span>
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={`dark:bg-whiteSecondary bg-blackPrimary w-${width} py-${py} text-${textSize} dark:hover:bg-white hover:bg-gray-800 bg-blackPrimary duration-200 flex items-center justify-center gap-x-2`}
    >
      {children}
      <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
        {text}
      </span>
    </button>
  );
};

export default WhiteButton;
