import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0E14] p-4 sm:p-6 relative">
      <div className="w-full flex justify-center">{children}</div>
    </div>
  );
}
