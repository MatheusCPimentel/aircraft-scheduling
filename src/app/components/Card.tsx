import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={`flex h-full flex-col items-center  bg-white rounded-lg shadow-md p-6 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
};
