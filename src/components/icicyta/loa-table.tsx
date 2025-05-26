import { useCallback, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios-config";
import { loaRoutes } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Printer, FileText } from "lucide-react";
import { LoaDialog } from "./loa-dialog";
import { PrintDialog } from "./print-dialog";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/auth/authStore";

export type Loa = {
  id: string;
  paper_id: string;
  paper_title: string;
  author_names: string | string[];
  status: "Accepted" | "Rejected";
  tempat_tanggal: string;
  picture: string;
  nama_penandatangan: string;
  jabatan_penandatangan: string;
  signature_id: string;
  theme_conference: string;
  place_date_conference: string;
  created_at: Date;
};

export function LoaTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLoa, setCurrentLoa] = useState<Loa | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [currentPrintLoa, setCurrentPrintLoa] = useState<Loa | null>(null);
  const [printMode, setPrintMode] = useState<"single" | "all">("all");
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  // Fetch LOAs
  const { data: loas = [], isLoading } = useQuery<Loa[]>({
    queryKey: ["icicyta-loas"],
    queryFn: async () => {
      const response = await api.get(loaRoutes.listICICYTA);
      return response.data;
    },
  });

  // Mutation for deleting an LOA
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(loaRoutes.deleteICICYTA(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icicyta-loas"] });
      toast.success("LoA deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete LoA");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this LoA?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = useCallback((loa: Loa) => {
    setCurrentLoa(loa);
    setDialogMode("edit");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleView = useCallback((loa: Loa) => {
    setCurrentLoa(loa);
    setDialogMode("view");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleCreate = useCallback(() => {
    setCurrentLoa(null);
    setDialogMode("create");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handlePrint = useCallback(() => {
    setPrintMode("all");
    setCurrentPrintLoa(null);
    setTimeout(() => {
      setIsPrintDialogOpen(true);
    }, 0);
  }, []);

  const handlePrintSingle = useCallback((loa: Loa) => {
    setPrintMode("single");
    setCurrentPrintLoa(loa);
    setTimeout(() => {
      setIsPrintDialogOpen(true);
    }, 0);
  }, []);

  const columns: ColumnDef<Loa>[] = [
    {
      accessorKey: "paper_id",
      header: "Paper ID",
    },
    {
      accessorKey: "author_names",
      header: "Author Name",
      cell: ({ row }) => {
        const authors = row.getValue("author_names") as string | string[];
        const formatted = Array.isArray(authors) ? authors.join(", ") : authors;
        return (
          <div className="max-w-[250px] truncate whitespace-nowrap overflow-hidden">
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "paper_title",
      header: "Conference Title",
      cell: ({ row }) => {
        const title = row.getValue("paper_title") as string;
        return (
          <div className="max-w-[250px] truncate whitespace-nowrap overflow-hidden">
            {title}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
              status === "Accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "tempat_tanggal",
      header: "Place & Date",
    },
    {
      accessorKey: "place_date_conference",
      header: "Conference Held On",
      cell: ({ row }) => {
        const title = row.getValue("place_date_conference") as string;
        return (
          <div className="max-w-[250px] truncate whitespace-nowrap overflow-hidden">
            {title}
          </div>
        );
      },
    },
    {
      accessorKey: "theme_conference",
      header: "Theme",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const loa = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleView(loa)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(loa)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintSingle(loa)}>
                <FileText className="mr-2 h-4 w-4" />
                Print PDF
              </DropdownMenuItem>

              {user?.role !== 1 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(loa.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: loas,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          disabled={isLoading}
          placeholder="Filter by paper title..."
          value={
            (table.getColumn("paper_title")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("paper_title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          {loas.length ? (
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print All
            </Button>
          ) : null}

          <Button onClick={handleCreate} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add New LoA
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No LoAs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <LoaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        loa={currentLoa}
      />

      <PrintDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        data={
          printMode === "single" && currentPrintLoa ? currentPrintLoa : loas
        }
        title={
          printMode === "single"
            ? "Print Letter of Acceptance"
            : "Print Letters of Acceptance"
        }
        description={
          printMode === "single"
            ? "Preview and print this Letter of Acceptance"
            : "Preview and print all Letters of Acceptance"
        }
        singleMode={printMode === "single"}
      />
    </div>
  );
}
