import { useCallback, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios-config";
import { virtualAccountRoutes } from "@/api";
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
import { VirtualAccountDialog } from "@/components/virtual-account/virtual-account-dialog";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/auth/authStore";
import { DataTablePagination } from "@/components/data-table-pagination";

export type VirtualAccount = {
  id: string;
  nomor_virtual_akun: string;
  account_holder_name: string;
  bank_name: string;
  bank_branch: string;
  token: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export function VirtualAccountTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVirtualAccount, setCurrentVirtualAccount] =
    useState<VirtualAccount | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.role === 1;

  // Fetch Virtual Accounts
  const { data: virtualAccounts = [], isLoading } = useQuery<VirtualAccount[]>({
    queryKey: ["virtual-accounts"],
    queryFn: async () => {
      const response = await api.get(virtualAccountRoutes.list);
      return response.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(virtualAccountRoutes.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-accounts"] });
      toast.success("Virtual account deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete virtual account");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this virtual account?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = useCallback((virtualAccount: VirtualAccount) => {
    setCurrentVirtualAccount(virtualAccount);
    setDialogMode("edit");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleView = useCallback((virtualAccount: VirtualAccount) => {
    setCurrentVirtualAccount(virtualAccount);
    setDialogMode("view");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleCreate = useCallback(() => {
    setCurrentVirtualAccount(null);
    setDialogMode("create");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const columns: ColumnDef<VirtualAccount>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nomor_virtual_akun",
      header: "Account Number",
    },
    {
      accessorKey: "account_holder_name",
      header: "Account Holder",
    },
    {
      accessorKey: "bank_name",
      header: "Bank Name",
    },
    {
      accessorKey: "bank_branch",
      header: "Bank Branch",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const virtualAccount = row.original;

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
              <DropdownMenuItem onClick={() => handleView(virtualAccount)}>
                View
              </DropdownMenuItem>
              {isSuperAdmin && (
                <>
                  <DropdownMenuItem onClick={() => handleEdit(virtualAccount)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(virtualAccount.id)}
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
    data: virtualAccounts,
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
            (table.getColumn("bank_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("bank_name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        {showAddButton && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Virtual Account
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
                  No virtual accounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      <VirtualAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        virtualAccount={currentVirtualAccount}
      />
    </div>
  );
}
