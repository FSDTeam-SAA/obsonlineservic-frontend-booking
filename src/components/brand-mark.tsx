type BrandMarkProps = {
  className?: string;
  title?: string;
};

export function BrandMark({ className, title }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d="M8 25.5 24 10l16 15.5v13A3.5 3.5 0 0 1 36.5 42h-25A3.5 3.5 0 0 1 8 38.5v-13Z" fill="currentColor" />
      <path d="M16.5 27.5 24 20l7.5 7.5V42h-15V27.5Z" fill="white" fillOpacity=".94" />
      <path d="M21 42v-8.5h6V42" fill="currentColor" />
      <path d="m12 17 12-11 12 11" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.25" />
    </svg>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={className}>
      <BrandMark className="size-7" />
      <span className="text-[11px] font-black leading-[0.82] tracking-[-0.09em]">
        BOOKING IS<br />YOURS
      </span>
    </span>
  );
}
