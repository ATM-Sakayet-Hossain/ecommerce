export default function PageContainer({
  children,
  className = "",
  maxWidth = "max-w-7xl",
}) {
  return (
    <div className={`mx-auto ${maxWidth} px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
