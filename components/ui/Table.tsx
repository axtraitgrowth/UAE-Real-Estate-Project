import React from "react";
import { cn } from "@/utils/cn";

export function Table({ className, children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-slate-800">
      <table className={cn("w-full caption-bottom text-sm text-left border-collapse", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("bg-slate-900/90 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-slate-800/80 bg-[#0F1420]/40", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-slate-800/40 data-[state=selected]:bg-slate-800",
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
    <th className={cn("h-10 px-4 text-left align-middle font-medium text-slate-400", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("p-4 align-middle text-slate-300", className)} {...props}>
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
