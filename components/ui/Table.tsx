import React from "react";
import { cn } from "@/utils/cn";

export function Table({ className, children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[#1E2638] bg-[#10141E]">
      <table className={cn("w-full caption-bottom text-xs sm:text-sm text-left border-collapse", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("bg-[#0B0E14] border-b border-[#1E2638] text-[10px] uppercase font-mono tracking-wider text-slate-400", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-[#1E2638] bg-[#10141E]", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-[#151B28]/80 data-[state=selected]:bg-[#151B28]",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn("h-9 px-3.5 sm:px-4 text-left align-middle font-semibold text-slate-400 select-none", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("p-3 sm:p-3.5 align-middle text-slate-300", className)} {...props}>
      {children}
    </td>
  );
}

export function TableEmpty({ colSpan = 5, message = "No records found" }: { colSpan?: number; message?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-24 text-center text-sm text-slate-500">
        {message}
      </td>
    </tr>
  );
}
