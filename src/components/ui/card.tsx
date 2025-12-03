import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-md border border-border bg-card p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardValue({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono-num text-2xl font-semibold text-foreground tracking-tight ${className}`}
    >
      {children}
    </p>
  );
}
