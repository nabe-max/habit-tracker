"use client";

import { forwardRef } from "react";

interface FlipPageProps {
  children: React.ReactNode;
  className?: string;
}

export const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(
  function FlipPage({ children, className }, ref) {
    return (
      <div
        ref={ref}
        className={`overflow-hidden bg-[#fffef9] shadow-inner ${className ?? ""}`}
      >
        {children}
      </div>
    );
  },
);
