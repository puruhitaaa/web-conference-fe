import { useState } from "react"
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
} from "@tanstack/react-table"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { protectedRoutes } from "@/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus } from "lucide-react"
import { ReceiptDialog } from "./receipt-dialog"
import toast from "react-hot-toast"

export type Receipt = {
  id: string
  receiptNumber: string
  placeAndDate: string
  authorName: string
  institution: string
  email: string
  paperId: string
  paperTitle: string
  description: string
  amount: number
  paymentMethod: string
  paymentDate: string
  status: "paid" | "pending" | "cancelled"
  notes: string
}

export function ReceiptTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create")
  
  const queryClient = useQueryClient()

  // Fetch Receipts
  const { data: receipts = [], isLoading } = useQuery<Receipt[]>({
    queryKey: ["receipts"],
    queryFn: async () => {
      const response = await axios.get(protectedRoutes.receipts)
      return response.data
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${protectedRoutes.receipts}/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] })
      toast.success("Receipt deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete receipt")
    }
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this receipt?")) {
      deleteMutation.mutate(id)
    }
  }

  const handleEdit = (receipt: Receipt) => {
    setCurrentReceipt(receipt)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleView = (receipt: Receipt) => {
    setCurrentReceipt(receipt)
    setDialogMode("view")
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setCurrentReceipt(null)
    setDialogMode("create")
    setIsDialogOpen(true)
  }

  const columns: ColumnDef<Receipt>[] = [
    {
      accessorKey: "receiptNumber",
      header: "Receipt #",
    },
    {
      accessorKey: "authorName",
      header: "Author Name",
    },
    {
      accessorKey: "paperId",
      header: "Paper ID",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
              status === "paid"
                ? "bg-green-100 text-green-800"
                : status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "paymentDate",
      header: "Payment Date",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const receipt = row.original

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
              <DropdownMenuItem onClick={() => handleView(receipt)}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(receipt)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(receipt.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

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
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by author name..."
          value={(table.getColumn("authorName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("authorName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add New Receipt
        </Button>
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
      
      <ReceiptDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        receipt={currentReceipt}
      />
    </div>
  )
}