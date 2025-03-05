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
import toast from "react-hot-toast"
import { Invoice } from "./invoice-table"

const formSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  placeAndDate: z.string().min(1, "Place and date is required"),
  authorName: z.string().min(1, "Author name is required"),
  institution: z.string().min(1, "Institution is required"),
  email: z.string().email("Invalid email address"),
  paperId: z.string().min(1, "Paper ID is required"),
  paperTitle: z.string().min(1, "Paper title is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  price: z.coerce.number().positive("Price must be positive"),
  total: z.coerce.number().positive("Total must be positive"),
  department: z.string().min(1, "Department is required"),
  signature: z.string().min(1, "Signature is required"),
})

type InvoiceFormValues = z.infer<typeof formSchema>

interface InvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  invoice: Invoice | null
}

export function InvoiceDialog({ open, onOpenChange, mode, invoice }: InvoiceDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: "",
      placeAndDate: "",
      authorName: "",
      institution: "",
      email: "",
      paperId: "",
      paperTitle: "",
      description: "",
      quantity: 1,
      price: 0,
      total: 0,
      department: "",
      signature: "",
    },
  })

  // Reset form when dialog opens with invoice data
  useEffect(() => {
    if (open && invoice) {
      form.reset({
        invoiceNumber: invoice.invoiceNumber,
        placeAndDate: invoice.placeAndDate,
        authorName: invoice.authorName,
        institution: invoice.institution,
        email: invoice.email,
        paperId: invoice.paperId,
        paperTitle: invoice.paperTitle,
        description: invoice.description,
        quantity: invoice.quantity,
        price: invoice.price,
        total: invoice.total,
        department: invoice.department,
        signature: invoice.signature,
      })
    } else if (open && !invoice) {
      form.reset({
        invoiceNumber: `INV-${new Date().getTime().toString().slice(-6)}`,
        placeAndDate: new Date().toLocaleDateString(),
        authorName: "",
        institution: "",
        email: "",
        paperId: "",
        paperTitle: "",
        description: "Conference registration fee",
        quantity: 1,
        price: 0,
        total: 0,
        department: "",
        signature: "",
      })
    }
  }, [open, invoice, form])

  // Watch quantity and price to calculate total
  const quantity = form.watch("quantity")
  const price = form.watch("price")

  useEffect(() => {
    const total = quantity * price
    form.setValue("total", total)
  }, [quantity, price, form])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (values: InvoiceFormValues) => {
      const response = await axios.post(protectedRoutes.invoices, {
        ...values,
        id: crypto.randomUUID(),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      toast.success("Invoice created successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to create invoice")
    },
    onSettled: () => {
      setIsSubmitting(false)
    }
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: InvoiceFormValues & { id: string }) => {
      const response = await axios.put(`${protectedRoutes.invoices}/${values.id}`, values)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      toast.success("Invoice updated successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to update invoice")
    },
    onSettled: () => {
      setIsSubmitting(false)
    }
  })

  function onSubmit(values: InvoiceFormValues) {
    setIsSubmitting(true)
    
    if (mode === "edit" && invoice) {
      updateMutation.mutate({ ...values, id: invoice.id })
    } else {
      createMutation.mutate(values)
    }
  }

  const isViewMode = mode === "view"
  const title = mode === "create" ? "Create New Invoice" : mode === "edit" ? "Edit Invoice" : "View Invoice"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Fill in the details to create a new invoice." 
              : mode === "edit" 
                ? "Edit the invoice details." 
                : "View invoice details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="INV-123456" 
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
                name="placeAndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place and Date</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Jakarta, January 1, 2023" 
                        {...field} 
                        disabled={isViewMode} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
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
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="University of Example" 
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="john.doe@example.com" 
                      type="email"
                      {...field} 
                      disabled={isViewMode} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paperId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="PP-123" 
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
                name="paperTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Research on Example Topic" 
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Conference registration fee" 
                      {...field} 
                      disabled={isViewMode} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
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
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        {...field} 
                        disabled={true} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Computer Science" 
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
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Dr. John Smith" 
                        {...field} 
                        disabled={isViewMode} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              {!isViewMode ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save changes"}
                </Button>
              ) : (
                <Button type="button" onClick={() => onOpenChange(false)}>
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