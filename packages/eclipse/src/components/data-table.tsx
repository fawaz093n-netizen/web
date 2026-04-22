import * as React from "react";

import { cn } from "../lib/cn";
import { Checkbox } from "./checkbox";

// ─── DataTable ───────────────────────────────────────────────────────────────

const DataTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-square border border-stroke-neutral">
    <table
      ref={ref}
      className={cn("w-full caption-bottom type-text-sm", className)}
      {...props}
    />
  </div>
));
DataTable.displayName = "DataTable";

// ─── DataTableHeader ─────────────────────────────────────────────────────────

const DataTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-white/50 backdrop-blur-[24px] [&_tr]:border-b [&_tr]:border-stroke-neutral",
      className,
    )}
    {...props}
  />
));
DataTableHeader.displayName = "DataTableHeader";

// ─── DataTableHeaderRow ──────────────────────────────────────────────────────

interface DataTableHeaderRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  showCheckbox?: boolean;
}

const DataTableHeaderRow = React.forwardRef<HTMLTableRowElement, DataTableHeaderRowProps>(
  ({ className, showCheckbox = false, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b border-stroke-neutral", className)}
      {...props}
    >
      {showCheckbox && (
        <th className="py-3 pl-12 pr-3 w-12 text-left align-middle">
          <Checkbox />
        </th>
      )}
      {children}
    </tr>
  ),
);
DataTableHeaderRow.displayName = "DataTableHeaderRow";

// ─── DataTableHeaderCell ─────────────────────────────────────────────────────

interface DataTableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
}

const DataTableHeaderCell = React.forwardRef<HTMLTableCellElement, DataTableHeaderCellProps>(
  ({ className, title, subtitle, showSubtitle = false, children, ...props }, ref) => {
    const content =
      children ??
      (title != null ? (
        <div className="flex flex-col gap-1 w-full">
          <span>{title}</span>
          {showSubtitle && subtitle && (
            <span className="type-text-xs text-foreground-neutral-weak font-normal">
              {subtitle}
            </span>
          )}
        </div>
      ) : null);

    return (
      <th
        ref={ref}
        className={cn(
          "py-3 px-3 first:pl-12 last:pr-12 text-left align-middle type-text-sm-strong text-foreground-neutral",
          className,
        )}
        {...props}
      >
        {content}
      </th>
    );
  },
);
DataTableHeaderCell.displayName = "DataTableHeaderCell";

// ─── DataTableBody ────────────────────────────────────────────────────────────

const DataTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
DataTableBody.displayName = "DataTableBody";

// ─── DataTableRow ────────────────────────────────────────────────────────────

interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  showCheckbox?: boolean;
}

const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(
  ({ className, showCheckbox = false, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-stroke-neutral transition-colors hover:bg-background-neutral-weak data-[state=selected]:bg-background-neutral-weak",
        className,
      )}
      {...props}
    >
      {showCheckbox && (
        <td className="py-3 pl-12 pr-3 w-12 align-middle bg-background-default">
          <Checkbox />
        </td>
      )}
      {children}
    </tr>
  ),
);
DataTableRow.displayName = "DataTableRow";

// ─── DataTableCell ────────────────────────────────────────────────────────────

interface DataTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
}

const DataTableCell = React.forwardRef<HTMLTableCellElement, DataTableCellProps>(
  ({ className, title, subtitle, showSubtitle = false, children, ...props }, ref) => {
    const content =
      children ??
      (title != null ? (
        <div className="flex flex-col gap-1 w-full">
          <span className="type-text-sm text-foreground-neutral">{title}</span>
          {showSubtitle && subtitle && (
            <span className="type-text-xs text-foreground-neutral-weak">{subtitle}</span>
          )}
        </div>
      ) : null);

    return (
      <td
        ref={ref}
        className={cn(
          "py-3 px-3 first:pl-12 last:pr-12 align-middle bg-background-default",
          className,
        )}
        {...props}
      >
        {content}
      </td>
    );
  },
);
DataTableCell.displayName = "DataTableCell";

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  DataTable,
  DataTableHeader,
  DataTableHeaderRow,
  DataTableHeaderCell,
  DataTableBody,
  DataTableRow,
  DataTableCell,
};
