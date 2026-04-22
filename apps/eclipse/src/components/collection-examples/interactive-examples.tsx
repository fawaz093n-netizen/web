"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronDown, SlidersHorizontal } from "lucide-react";
import {
  Button,
  Collection,
  CollectionBody,
  CollectionFooter,
  CollectionHeader,
  CollectionHeaderMenu,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableHeaderRow,
  DataTableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationInput,
  PaginationItem,
  PaginationLink,
} from "@prisma/eclipse";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

type Model = {
  id: number;
  name: string;
  fields: number;
  relations: number;
  status: "Active" | "Deprecated";
  updatedAt: string;
};

const SAMPLE_DATA: Model[] = [
  {
    id: 1,
    name: "User",
    fields: 12,
    relations: 3,
    status: "Active",
    updatedAt: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Post",
    fields: 8,
    relations: 2,
    status: "Active",
    updatedAt: "Jan 14, 2024",
  },
  {
    id: 3,
    name: "Comment",
    fields: 5,
    relations: 2,
    status: "Active",
    updatedAt: "Jan 13, 2024",
  },
  {
    id: 4,
    name: "Category",
    fields: 4,
    relations: 1,
    status: "Active",
    updatedAt: "Jan 12, 2024",
  },
  {
    id: 5,
    name: "Tag",
    fields: 3,
    relations: 1,
    status: "Active",
    updatedAt: "Jan 11, 2024",
  },
  {
    id: 6,
    name: "Profile",
    fields: 9,
    relations: 1,
    status: "Active",
    updatedAt: "Jan 10, 2024",
  },
  {
    id: 7,
    name: "Product",
    fields: 15,
    relations: 4,
    status: "Active",
    updatedAt: "Jan 9, 2024",
  },
  {
    id: 8,
    name: "Order",
    fields: 11,
    relations: 3,
    status: "Active",
    updatedAt: "Jan 8, 2024",
  },
  {
    id: 9,
    name: "OrderItem",
    fields: 6,
    relations: 2,
    status: "Deprecated",
    updatedAt: "Jan 7, 2024",
  },
  {
    id: 10,
    name: "Review",
    fields: 7,
    relations: 2,
    status: "Active",
    updatedAt: "Jan 6, 2024",
  },
  {
    id: 11,
    name: "Notification",
    fields: 8,
    relations: 1,
    status: "Active",
    updatedAt: "Jan 5, 2024",
  },
  {
    id: 12,
    name: "AuditLog",
    fields: 10,
    relations: 2,
    status: "Deprecated",
    updatedAt: "Jan 4, 2024",
  },
  {
    id: 13,
    name: "Media",
    fields: 9,
    relations: 1,
    status: "Active",
    updatedAt: "Jan 3, 2024",
  },
];

const ITEMS_PER_PAGE = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type View = "All" | "Active" | "Deprecated";
type SortDir = "asc" | "desc";

function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

// ---------------------------------------------------------------------------
// Full Collection Example
// ---------------------------------------------------------------------------

export function FullCollectionExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<View>("All");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(
    () =>
      view === "All"
        ? SAMPLE_DATA
        : SAMPLE_DATA.filter((m) => m.status === view),
    [view],
  );

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        sortDir === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      ),
    [filtered, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = sorted.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const goTo = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handleViewChange = (v: View) => {
    setView(v);
    setCurrentPage(1);
  };

  const viewLabel = view === "All" ? "All Items" : `${view} Items`;

  return (
    <Collection>
      <CollectionHeader>
        <CollectionHeaderMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="lg">
                {viewLabel}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleViewChange("All")}>
                All Items
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleViewChange("Active")}>
                Active Items
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleViewChange("Deprecated")}>
                Deprecated Items
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CollectionHeaderMenu>

        <CollectionHeaderMenu>
          <Button variant="default" size="lg">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort {sortDir === "asc" ? "A→Z" : "Z→A"}
          </Button>
        </CollectionHeaderMenu>
      </CollectionHeader>

      <CollectionBody>
        <DataTable>
          <DataTableHeader>
            <DataTableHeaderRow>
              <DataTableHeaderCell title="Model" />
              <DataTableHeaderCell title="Fields" />
              <DataTableHeaderCell title="Relations" />
              <DataTableHeaderCell title="Status" />
              <DataTableHeaderCell title="Last Updated" />
            </DataTableHeaderRow>
          </DataTableHeader>
          <DataTableBody>
            {rows.map((model) => (
              <DataTableRow key={model.id}>
                <DataTableCell title={model.name} />
                <DataTableCell title={String(model.fields)} />
                <DataTableCell title={String(model.relations)} />
                <DataTableCell title={model.status} />
                <DataTableCell title={model.updatedAt} />
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </CollectionBody>

      <CollectionFooter>
        <PaginationInput
          key={safePage}
          value={safePage}
          totalPages={totalPages}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            goTo(parseInt(e.target.value, 10))
          }
        />
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            {getPageRange(safePage, totalPages).map((p, i) =>
              p === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === safePage}
                    onClick={() => goTo(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
          </PaginationContent>
        </Pagination>
      </CollectionFooter>
    </Collection>
  );
}

// ---------------------------------------------------------------------------
// Collection without header (showHeader=false)
// ---------------------------------------------------------------------------

export function CollectionNoHeaderExample() {
  return (
    <Collection showHeader={false}>
      <CollectionHeader>{/* hidden — showHeader=false */}</CollectionHeader>

      <CollectionBody>
        <DataTable>
          <DataTableHeader>
            <DataTableHeaderRow>
              <DataTableHeaderCell title="Model" />
              <DataTableHeaderCell title="Fields" />
              <DataTableHeaderCell title="Status" />
            </DataTableHeaderRow>
          </DataTableHeader>
          <DataTableBody>
            {SAMPLE_DATA.slice(0, 3).map((model) => (
              <DataTableRow key={model.id}>
                <DataTableCell title={model.name} />
                <DataTableCell title={String(model.fields)} />
                <DataTableCell title={model.status} />
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </CollectionBody>

      <CollectionFooter>
        <span className="type-text-sm text-foreground-neutral-weak">
          3 models
        </span>
      </CollectionFooter>
    </Collection>
  );
}

// ---------------------------------------------------------------------------
// Collection without footer (showFooter=false)
// ---------------------------------------------------------------------------

export function CollectionNoFooterExample() {
  return (
    <Collection showFooter={false}>
      <CollectionHeader>
        <CollectionHeaderMenu>
          <Button variant="default" size="lg">
            All Items
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </CollectionHeaderMenu>
        <CollectionHeaderMenu>
          <Button variant="default" size="lg">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </Button>
        </CollectionHeaderMenu>
      </CollectionHeader>

      <CollectionBody>
        <DataTable>
          <DataTableHeader>
            <DataTableHeaderRow>
              <DataTableHeaderCell title="Model" />
              <DataTableHeaderCell title="Fields" />
              <DataTableHeaderCell title="Status" />
            </DataTableHeaderRow>
          </DataTableHeader>
          <DataTableBody>
            {SAMPLE_DATA.slice(0, 3).map((model) => (
              <DataTableRow key={model.id}>
                <DataTableCell title={model.name} />
                <DataTableCell title={String(model.fields)} />
                <DataTableCell title={model.status} />
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </CollectionBody>

      <CollectionFooter>{/* hidden — showFooter=false */}</CollectionFooter>
    </Collection>
  );
}

// ---------------------------------------------------------------------------
// DataTable with row checkboxes and selection
// ---------------------------------------------------------------------------

export function DataTableWithCheckboxesExample() {
  const [selected, setSelected] = useState<number[]>([]);
  const rows = SAMPLE_DATA.slice(0, 5);

  const toggleAll = () =>
    setSelected((prev) =>
      prev.length === rows.length ? [] : rows.map((r) => r.id),
    );

  const toggleRow = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  return (
    <div className="space-y-2">
      <DataTable>
        <DataTableHeader>
          <DataTableHeaderRow
            showCheckbox
            onClick={toggleAll}
            className="cursor-pointer"
          >
            <DataTableHeaderCell title="Model" />
            <DataTableHeaderCell title="Fields" />
            <DataTableHeaderCell title="Status" />
            <DataTableHeaderCell title="Last Updated" />
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
          {rows.map((model) => (
            <DataTableRow
              key={model.id}
              showCheckbox
              data-state={selected.includes(model.id) ? "selected" : undefined}
              onClick={() => toggleRow(model.id)}
              className="cursor-pointer"
            >
              <DataTableCell title={model.name} />
              <DataTableCell title={String(model.fields)} />
              <DataTableCell title={model.status} />
              <DataTableCell title={model.updatedAt} />
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
      {selected.length > 0 && (
        <p className="type-text-sm text-foreground-neutral-weak">
          {selected.length} of {rows.length} row
          {selected.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataTable with title + subtitle cells
// ---------------------------------------------------------------------------

export function DataTableWithSubtitlesExample() {
  return (
    <DataTable>
      <DataTableHeader>
        <DataTableHeaderRow>
          <DataTableHeaderCell
            title="Model Name"
            subtitle="Prisma model identifier"
            showSubtitle
          />
          <DataTableHeaderCell
            title="Fields"
            subtitle="Scalar field count"
            showSubtitle
          />
          <DataTableHeaderCell
            title="Relations"
            subtitle="Relation field count"
            showSubtitle
          />
          <DataTableHeaderCell
            title="Last Updated"
            subtitle="Most recent schema change"
            showSubtitle
          />
        </DataTableHeaderRow>
      </DataTableHeader>
      <DataTableBody>
        {SAMPLE_DATA.slice(0, 4).map((model) => (
          <DataTableRow key={model.id}>
            <DataTableCell
              title={model.name}
              subtitle={`id: ${model.id}`}
              showSubtitle
            />
            <DataTableCell title={String(model.fields)} />
            <DataTableCell title={String(model.relations)} />
            <DataTableCell title={model.updatedAt} />
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
