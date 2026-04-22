"use client";

import * as React from "react";
import { cn } from "../lib/cn";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CollectionContextValue {
  showHeader: boolean;
  showFooter: boolean;
}

const CollectionContext = React.createContext<CollectionContextValue>({
  showHeader: true,
  showFooter: true,
});

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------

export interface CollectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the CollectionHeader should be rendered.
   * @default true
   */
  showHeader?: boolean;
  /**
   * Whether the CollectionFooter should be rendered.
   * @default true
   */
  showFooter?: boolean;
}

const Collection = React.forwardRef<HTMLDivElement, CollectionProps>(
  ({ className, showHeader = true, showFooter = true, children, ...props }, ref) => (
    <CollectionContext.Provider value={{ showHeader, showFooter }}>
      <div
        ref={ref}
        className={cn("flex flex-col gap-6 w-full", className)}
        {...props}
      >
        {children}
      </div>
    </CollectionContext.Provider>
  ),
);
Collection.displayName = "Collection";

// ---------------------------------------------------------------------------
// CollectionHeader
// ---------------------------------------------------------------------------

/**
 * Top bar of the collection. Renders two sides (left & right) separated by
 * justify-between.  Visibility is controlled by the `showHeader` prop on the
 * parent `Collection`.
 */
const CollectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { showHeader } = React.useContext(CollectionContext);
  if (!showHeader) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-row items-center justify-between w-full",
        className,
      )}
      {...props}
    />
  );
});
CollectionHeader.displayName = "CollectionHeader";

// ---------------------------------------------------------------------------
// CollectionHeaderMenu
// ---------------------------------------------------------------------------

/**
 * A horizontal group of controls inside a CollectionHeader.
 * Use one for the left side (e.g. a view-switcher dropdown) and one for the
 * right side (e.g. Filter / Sort buttons).
 */
const CollectionHeaderMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-row items-center gap-2", className)}
    {...props}
  />
));
CollectionHeaderMenu.displayName = "CollectionHeaderMenu";

// ---------------------------------------------------------------------------
// CollectionBody
// ---------------------------------------------------------------------------

/**
 * Slot for the main content of the collection (typically a DataTable).
 */
const CollectionBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col w-full overflow-hidden", className)}
    {...props}
  />
));
CollectionBody.displayName = "CollectionBody";

// ---------------------------------------------------------------------------
// CollectionFooter
// ---------------------------------------------------------------------------

/**
 * Bottom bar of the collection.  Typically contains a PaginationInput on the
 * left and PaginationContent on the right.  Visibility is controlled by the
 * `showFooter` prop on the parent `Collection`.
 */
const CollectionFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { showFooter } = React.useContext(CollectionContext);
  if (!showFooter) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-row items-center justify-between w-full",
        className,
      )}
      {...props}
    />
  );
});
CollectionFooter.displayName = "CollectionFooter";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Collection,
  CollectionHeader,
  CollectionHeaderMenu,
  CollectionBody,
  CollectionFooter,
};
