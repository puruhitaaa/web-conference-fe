import { useState } from "react";
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
import { paymentRoutes } from "@/api";
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
import { MoreHorizontal, FileText } from "lucide-react";
import { ReceiptPrintDialog } from "./receipt-print-dialog";
import toast from "react-hot-toast";
// import { useAuthStore } from "@/lib/auth/authStore";

export type Receipt = {
  id: string;
  invoice_no: string;
  received_from: string;
  amount: number;
  in_payment_of: string;
  payment_date: Date;
  paper_id: string;
  paper_title: string;
  signature_id: string;
};

export function ReceiptTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [, setIsDialogOpen] = useState(false);
  // const [, setCurrentReceipt] = useState<Receipt | null>(null);
  // const [, setDialogMode] = useState<"view">("view");
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [currentPrintReceipt, setCurrentPrintReceipt] =
    useState<Receipt | null>(null);
  const [printMode, setPrintMode] = useState<"single" | "all">("all");

  // const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: receipts = [], isLoading } = useQuery<Receipt[]>({
    queryKey: ["icicyta-receipts"],
    queryFn: async () => {
      const response = await api.get(paymentRoutes.listICICYTA);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(paymentRoutes.deleteICICYTA(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icicyta-receipts"] });
      toast.success("Receipt deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete receipt");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this receipt?")) {
      deleteMutation.mutate(id);
    }
  };

  // const handleEdit = (receipt: Receipt) => {
  //   setCurrentReceipt(receipt);
  //   setDialogMode("edit");
  //   setIsDialogOpen(true);
  // };

  // const handleView = (receipt: Receipt) => {
  //   setCurrentReceipt(receipt);
  //   setDialogMode("view");
  //   setIsDialogOpen(true);
  // };

  // const handleCreate = () => {
  //   setCurrentReceipt(null);
  //   setDialogMode("create");
  //   setIsDialogOpen(true);
  // };

  // const handlePrint = () => {
  //   if (!receipts.length) return toast.error("No receipts found");

  //   setPrintMode("all");
  //   setCurrentPrintReceipt(null);
  //   setIsPrintDialogOpen(true);
  // };

  const handlePrintSingle = (receipt: Receipt) => {
    setPrintMode("single");
    setCurrentPrintReceipt(receipt);
    setIsPrintDialogOpen(true);
  };

  const columns: ColumnDef<Receipt>[] = [
    {
      accessorKey: "invoice_no",
      header: "Invoice No",
    },
    {
      accessorKey: "received_from",
      header: "Received From",
    },
    {
      accessorKey: "paper_title",
      header: "Conferece Title",
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
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "in_payment_of",
      header: "In Payment of",
      cell: ({ row }) => {
        const title = row.getValue("in_payment_of") as string;
        return (
          <div className="max-w-[250px] truncate whitespace-nowrap overflow-hidden">
            {title}
          </div>
        );
      },
    },
    {
      accessorKey: "payment_date",
      header: "Payment Date",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const receipt = row.original;

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
              {/* <DropdownMenuItem onClick={() => handleView(receipt)}>
                View
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem onClick={() => handleEdit(receipt)}>
                Edit
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => handlePrintSingle(receipt)}>
                <FileText className="mr-2 h-4 w-4" />
                Print PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(receipt.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: receipts,
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
          placeholder="Filter by author name..."
          value={
            (table.getColumn("authorName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("authorName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                  No receipts found.
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

      <ReceiptPrintDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        data={
          printMode === "single" && currentPrintReceipt
            ? currentPrintReceipt
            : receipts
        }
        title={printMode === "single" ? "Print Receipt" : "Print All Receipts"}
        description={
          printMode === "single"
            ? "Preview and print this receipt"
            : "Preview and print all receipts"
        }
        singleMode={printMode === "single"}
      />
    </div>
  );
}
