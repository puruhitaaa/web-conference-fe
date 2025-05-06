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
import { adminRoutes } from "@/api";
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
// import { BankTransferDialog } from "./bank-transfer-dialog"
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/auth/authStore";
import { DataTablePagination } from "../data-table-pagination";
import { AccountUserDialog } from "./accounts-dialog";

export type AccountUsers = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: "icicyta" | "icodsa" | "superadmin";
};

export function AccountManagementTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAccountUser, setCurrentAccountUser] =
    useState<AccountUsers | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.role === 1;

  const { data: accountUsers = [], isLoading } = useQuery<AccountUsers[]>({
    queryKey: ["account-management"],
    queryFn: async () => {
      const response = await api.get(adminRoutes.listAllAdmins);
      return response.data.admin;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(adminRoutes.deleteAdmin(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-management"] });
      toast.success("user account deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user account");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user account?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (accountUser: AccountUsers) => {
    setCurrentAccountUser(accountUser);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleView = (accountUser: AccountUsers) => {
    setCurrentAccountUser(accountUser);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setCurrentAccountUser(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<AccountUsers>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const accountUser = row.original;

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
              <DropdownMenuItem onClick={() => handleView(accountUser)}>
                View
              </DropdownMenuItem>
              {isSuperAdmin && (
                <>
                  <DropdownMenuItem onClick={() => handleEdit(accountUser)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(accountUser.id)}
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
    data: accountUsers,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="filter by username.."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("username")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        {isSuperAdmin && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Account
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
                  No user found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      <AccountUserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        userAccount={currentAccountUser}
      />
    </div>
  );
}
