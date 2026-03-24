export function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-8 w-8 rounded-full border-2 border-muted border-t-accent animate-spin" />
    </div>
  );
}
