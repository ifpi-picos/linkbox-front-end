import React from "react";
import Icon from "./Icon";

type ButtonProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  icon: string;
  children?: React.ReactNode;
  [k: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`min-w-[48px] w-[48px] h-[48px] flex justify-center items-center rounded-[50%] duration-[0.2s] select-none hover:cursor-pointer hover:bg-[#c2c8d1] hover:duration-[0.2s] active:bg-[#969da8] ${props.className ? " " + props.className : ""}`}
    >
      <Icon name={icon} />
      {children}
    </div>
  );
};

export default Button;
