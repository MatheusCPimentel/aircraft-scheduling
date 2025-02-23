import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`bg-white max-h-[550px] md:max-h-[880px] rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col text-center ${className}`}
    >
      {children}
    </div>
  );
};
