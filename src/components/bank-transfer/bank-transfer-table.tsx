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
import { bankTransferRoutes } from "@/api";
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
import { MoreHorizontal, Plus } from "lucide-react";
import { BankTransferDialog } from "./bank-transfer-dialog";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/auth/authStore";
import { DataTablePagination } from "../data-table-pagination";

export type BankTransfer = {
  id: string;
  nama_bank: string;
  swift_code: string;
  recipient_name: string;
  beneficiary_bank_account_no: string;
  bank_branch: string;
  bank_address: string;
  city: string;
  country: string;
  created_by: number;
};

export function BankTransferTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBankTransfer, setCurrentBankTransfer] =
    useState<BankTransfer | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.role === 1;

  const { data: bankTransfers = [], isLoading } = useQuery<BankTransfer[]>({
    queryKey: ["bank-transfers"],
    queryFn: async () => {
      const response = await api.get(bankTransferRoutes.list);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(bankTransferRoutes.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-transfers"] });
      toast.success("Bank transfer deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete bank transfer");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bank transfer?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = useCallback((bankTransfer: BankTransfer) => {
    setCurrentBankTransfer(bankTransfer);
    setDialogMode("edit");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleView = useCallback((bankTransfer: BankTransfer) => {
    setCurrentBankTransfer(bankTransfer);
    setDialogMode("view");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleCreate = useCallback(() => {
    setCurrentBankTransfer(null);
    setDialogMode("create");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const columns: ColumnDef<BankTransfer>[] = [
    {
      accessorKey: "nama_bank",
      header: "Bank Name",
    },
    {
      accessorKey: "swift_code",
      header: "SWIFT Code",
    },
    {
      accessorKey: "recipient_name",
      header: "Recipient Name",
    },
    {
      accessorKey: "beneficiary_bank_account_no",
      header: "Account Number",
    },
    {
      accessorKey: "bank_branch",
      header: "Branch",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const bankTransfer = row.original;

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
              <DropdownMenuItem onClick={() => handleView(bankTransfer)}>
                View
              </DropdownMenuItem>
              {isSuperAdmin && (
                <>
                  <DropdownMenuItem onClick={() => handleEdit(bankTransfer)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(bankTransfer.id)}
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
    data: bankTransfers,
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

  const showAddButton = isSuperAdmin && !isLoading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          disabled={isLoading}
          placeholder="Filter by bank name..."
          value={
            (table.getColumn("nama_bank")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("nama_bank")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        {showAddButton && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Bank Transfer
          </Button>
        )}
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
                  No bank transfers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      <BankTransferDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        bankTransfer={currentBankTransfer}
      />
    </div>
  );
}
