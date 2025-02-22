import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={`flex max-h-[880px] overflow-auto h-full flex-col items-center bg-white rounded-lg shadow-md p-6 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
};
