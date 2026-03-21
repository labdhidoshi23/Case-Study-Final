interface MapPlaceholderProps {
  className?: string;
}

export function MapPlaceholder({ className = "" }: MapPlaceholderProps) {
  return (
    <div className={`rounded-xl bg-muted flex items-center justify-center min-h-[300px] border border-border ${className}`}>
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground font-body">Map integration placeholder</p>
        <p className="text-xs text-muted-foreground/70 font-body">API key will be configured later</p>
      </div>
    </div>
  );
}
