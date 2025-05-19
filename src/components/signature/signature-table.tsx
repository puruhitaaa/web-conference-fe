import { signatureRoutes } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useAuthStore } from "@/lib/auth/authStore";
import api from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { DataTablePagination } from "../data-table-pagination";
import { SignatureUploadDialog } from "./upload-signature-dialog";
import { Input } from "../ui/input";

export type Signature = {
  id: string;
  picture: string;
  nama_penandatangan: string;
  jabatan_penandatangan: string;
  tanggal_dibuat: string;
};

export function SignatureTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<Signature | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.role === 1;

  const { data: signatureUser = [], isLoading } = useQuery<Signature[]>({
    queryKey: ["signature-users"],
    queryFn: async () => {
      const response = await api.get(signatureRoutes.list);
      return response.data;
    },
    // Add staleTime to prevent unnecessary refetches
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(signatureRoutes.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signature-users"] });
      toast.success("Signature deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete signature");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this signature?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = useCallback((signatureUser: Signature) => {
    setCurrentSignature(signatureUser);
    setDialogMode("edit");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleView = useCallback((signatureUser: Signature) => {
    setCurrentSignature(signatureUser);
    setDialogMode("view");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleCreate = useCallback(() => {
    setCurrentSignature(null);
    setDialogMode("create");
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  // Format the date string if it exists
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const columns: ColumnDef<Signature>[] = [
    {
      accessorKey: "id",
      header: "Signature ID",
    },
    {
      accessorKey: "nama_penandatangan",
      header: "Signatory Name",
    },
    {
      accessorKey: "jabatan_penandatangan",
      header: "Signatory's Position",
    },
    {
      accessorKey: "tanggal_dibuat",
      header: "Date Created",
      cell: ({ row }) => {
        return formatDate(row.original.tanggal_dibuat);
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const signatureUser = row.original;

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
              <DropdownMenuItem onClick={() => handleView(signatureUser)}>
                View
              </DropdownMenuItem>
              {isSuperAdmin && (
                <>
                  <DropdownMenuItem onClick={() => handleEdit(signatureUser)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(signatureUser.id)}
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
    data: signatureUser,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      sorting,
      columnFilters,
      pagination: {
        pageSize: 10, // Set a reasonable default page size
      },
    },
  });

  // Don't show add button during loading to prevent immediate interactions
  const showAddButton = isSuperAdmin && !isLoading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          disabled={isLoading}
          placeholder="filter by signatory name"
          value={
            (table
              .getColumn("nama_penandatangan")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table
              .getColumn("nama_penandatangan")
              ?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        {showAddButton && (
          <Button onClick={handleCreate} disabled={isLoading || isDialogOpen}>
            <Plus className="mr-2 h-4 w-4" /> Add Signature
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
                  No signatures found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination table={table} />

        {isDialogOpen && (
          <SignatureUploadDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            mode={dialogMode}
            signatureUser={currentSignature}
          />
        )}
      </div>
    </div>
  );
}
