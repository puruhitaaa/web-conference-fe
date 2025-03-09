import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { protectedRoutes } from "@/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { Receipt } from "./receipt-table"

const formSchema = z.object({
  receiptNumber: z.string().min(1, "Receipt number is required"),
  placeAndDate: z.string().min(1, "Place and date is required"),
  authorName: z.string().min(1, "Author name is required"),
  institution: z.string().min(1, "Institution is required"),
  email: z.string().email("Invalid email address"),
  paperId: z.string().min(1, "Paper ID is required"),
  paperTitle: z.string().min(1, "Paper title is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
  status: z.enum(["paid", "pending", "cancelled"]),
  notes: z.string().optional(),
})

type ReceiptFormValues = z.infer<typeof formSchema>

interface ReceiptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  receipt: Receipt | null
}

export function ReceiptDialog({
  open,
  onOpenChange,
  mode,
  receipt,
}: ReceiptDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiptNumber: "",
      placeAndDate: "",
      authorName: "",
      institution: "",
      email: "",
      paperId: "",
      paperTitle: "",
      description: "",
      amount: 0,
      paymentMethod: "",
      paymentDate: "",
      status: "pending",
      notes: "",
    },
  })

  // Reset form when dialog opens with receipt data
  useEffect(() => {
    if (open && receipt) {
      form.reset({
        receiptNumber: receipt.receiptNumber,
        placeAndDate: receipt.placeAndDate,
        authorName: receipt.authorName,
        institution: receipt.institution,
        email: receipt.email,
        paperId: receipt.paperId,
        paperTitle: receipt.paperTitle,
        description: receipt.description,
        amount: receipt.amount,
        paymentMethod: receipt.paymentMethod,
        paymentDate: receipt.paymentDate,
        status: receipt.status,
        notes: receipt.notes,
      })
    } else if (open && !receipt) {
      form.reset({
        receiptNumber: `ICICYTA-RCP-${new Date().getTime().toString().slice(-6)}`,
        placeAndDate: new Date().toLocaleDateString(),
        authorName: "",
        institution: "",
        email: "",
        paperId: "",
        paperTitle: "",
        description: "ICICYTA Conference registration payment",
        amount: 0,
        paymentMethod: "Bank Transfer",
        paymentDate: new Date().toLocaleDateString(),
        status: "pending",
        notes: "",
      })
    }
  }, [open, receipt, form])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (values: ReceiptFormValues) => {
      const response = await axios.post(protectedRoutes.receipts, {
        ...values,
        id: crypto.randomUUID(),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icicyta-receipts"] })
      toast.success("Receipt created successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to create receipt")
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: ReceiptFormValues & { id: string }) => {
      const response = await axios.put(
        `${protectedRoutes.receipts}/${values.id}`,
        values
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icicyta-receipts"] })
      toast.success("Receipt updated successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to update receipt")
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  function onSubmit(values: ReceiptFormValues) {
    setIsSubmitting(true)

    if (mode === "edit" && receipt) {
      updateMutation.mutate({ ...values, id: receipt.id })
    } else {
      createMutation.mutate(values)
    }
  }

  const isViewMode = mode === "view"
  const title =
    mode === "create"
      ? "Create New Receipt"
      : mode === "edit"
        ? "Edit Receipt"
        : "View Receipt"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new receipt."
              : mode === "edit"
                ? "Edit the receipt details."
                : "View receipt details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='receiptNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='ICICYTA-RCP-123456'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='placeAndDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place and Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Jakarta, January 1, 2023'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='authorName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='institution'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='University of Example'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='john.doe@example.com'
                      type='email'
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='paperId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='ICICYTA-123'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='paperTitle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Research on Example Topic'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='ICICYTA Conference registration payment'
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='0'
                        step='0.01'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='paymentMethod'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Bank Transfer'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='paymentDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='January 1, 2023'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    disabled={isViewMode}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='paid'>Paid</SelectItem>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='cancelled'>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Additional notes...'
                      className='max-h-40'
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              {!isViewMode ? (
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                      ? "Create"
                      : "Save changes"}
                </Button>
              ) : (
                <Button type='button' onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
