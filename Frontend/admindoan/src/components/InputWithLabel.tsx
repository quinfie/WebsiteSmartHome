const InputWithLabel = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <label className="dark:text-whiteSecondary text-blackPrimary block text-base font-semibold mb-1">
        {label}
      </label>
      {children}
    </div>
  );
};
export default InputWithLabel;
