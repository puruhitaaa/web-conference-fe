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
import { invoiceRoutes } from "@/api";
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
import { InvoiceDialog } from "./invoice-dialog";
import { InvoicePrintDialog } from "./invoice-print-dialog";
import toast from "react-hot-toast";

export type Invoice = {
  id: string;
  invoice_no: string;
  loa_id: string;
  institution: string | null;
  email: string | null;
  presentation_type: string | null;
  member_type: string | null;
  author_type: string | null;
  amount: number | null;
  date_of_issue: Date | null;
  signature_id: string;
  virtual_account_id: string | null;
  bank_transfer_id: string | null;
  created_by: string;
  status: "Pending" | "Paid";
  created_at: Date | null;
  updated_at: Date | null;
};

export function InvoiceTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [currentPrintInvoice, setCurrentPrintInvoice] =
    useState<Invoice | null>(null);
  const [printMode, setPrintMode] = useState<"single" | "all">("all");
  // const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["icodsa-invoices"],
    queryFn: async () => {
      const response = await api.get(invoiceRoutes.listICODSA);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(invoiceRoutes.deleteICODSA(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icodsa-invoices"] });
      toast.success("Invoice deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete invoice");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleView = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  // const handleCreate = () => {
  //   setCurrentInvoice(null)
  //   setDialogMode("create")
  //   setIsDialogOpen(true)
  // }

  // const handlePrint = () => {
  //   setPrintMode("all");
  //   setCurrentPrintInvoice(null);
  //   setIsPrintDialogOpen(true);
  // };

  const handlePrintSingle = (invoice: Invoice) => {
    setPrintMode("single");
    setCurrentPrintInvoice(invoice);
    setIsPrintDialogOpen(true);
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoice_no",
      header: "Invoice #",
    },
    {
      accessorKey: "loa_id",
      header: "LoA ID",
    },
    {
      accessorKey: "institution",
      header: "Institution",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "presentation_type",
      header: "Presentation Type",
    },
    {
      accessorKey: "member_type",
      header: "Member Type",
    },
    {
      accessorKey: "author_type",
      header: "Author Type",
    },
    {
      accessorKey: "bank_transfer_id",
      header: "Bank Transfer ID",
    },
    {
      accessorKey: "virtual_account_id",
      header: "Virtual Account ID",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "total",
      header: "Total",
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
              status === "Paid"
                ? "bg-green-100 text-green-800"
                : status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;

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
              <DropdownMenuItem onClick={() => handleView(invoice)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintSingle(invoice)}>
                <FileText className="mr-2 h-4 w-4" />
                Print PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(invoice.id)}
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
    data: invoices,
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
          placeholder="Filter by institution..."
          value={
            (table.getColumn("institution")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("institution")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          {/* {invoices.length ? (
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print All
            </Button>
          ) : null} */}
          {/* {user?.role === 2 ? (
            <Button onClick={handleCreate}>
              <Plus className='mr-2 h-4 w-4' /> Add New Invoice
            </Button>
          ) : null} */}
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
                  No invoices found.
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

      <InvoiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        invoice={currentInvoice}
      />

      <InvoicePrintDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        data={
          printMode === "single" && currentPrintInvoice
            ? currentPrintInvoice
            : invoices
        }
        title={printMode === "single" ? "Print Invoice" : "Print All Invoices"}
        description={
          printMode === "single"
            ? "Preview and print this invoice"
            : "Preview and print all invoices"
        }
        singleMode={printMode === "single"}
      />
    </div>
  );
}
