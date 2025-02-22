interface ShimmerBlockProps {
  className?: string;
}

export const ShimmerBlock = ({ className }: ShimmerBlockProps) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${
        className ?? ""
      }`}
    />
  );
};
