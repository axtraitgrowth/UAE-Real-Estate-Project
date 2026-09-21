import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#07090F] p-4 relative overflow-hidden">
      {/* Subtle luxury ambient lighting */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-600/5 blur-3xl" />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}
