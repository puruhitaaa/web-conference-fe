import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios-config";
import { invoiceRoutes } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Invoice } from "./invoice-table"; // Assuming the Invoice type is used here
import { Separator } from "@radix-ui/react-separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/lib/auth/authStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  invoice_no: z.string().min(1, "Invoice number is required"),
  loa_id: z.coerce.string().min(1, "LOA ID is required"),
  institution: z.string().nullable(),
  email: z.string().email("Invalid email address").nullable(),
  presentation_type: z.enum(["Onsite", "Online", ""]).nullable(),
  member_type: z.enum(["IEEE Member", "IEEE Non Member", ""]).nullable(),
  author_type: z.enum(["Author", "Student Author", ""]).nullable(),
  amount: z.number().nullable(),
  date_of_issue: z.date().nullable(),
  signature_id: z.coerce.string().min(1, "Signature ID is required"),
  virtual_account_id: z.string().nullable(),
  bank_transfer_id: z.string().nullable(),
  created_by: z.coerce.string().nullable(),
  status: z.enum(["Pending", "Paid", "Unpaid"]),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
});

type InvoiceFormValues = z.infer<typeof formSchema>;

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  invoice: Invoice | null;
}

export function InvoiceDialog({
  open,
  onOpenChange,
  mode,
  invoice,
}: InvoiceDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_no: "",
      loa_id: "",
      institution: null,
      email: null,
      presentation_type: null,
      member_type: null,
      author_type: null,
      amount: null,
      date_of_issue: null,
      signature_id: "",
      virtual_account_id: null,
      bank_transfer_id: null,
      created_by: "",
      status: "Pending",
      created_at: null,
      updated_at: null,
    },
  });

  useEffect(() => {
    if (open && invoice) {
      form.reset({
        invoice_no: invoice.invoice_no,
        loa_id: invoice.loa_id,
        institution: invoice.institution,
        email: invoice.email,
        presentation_type: invoice.presentation_type as
          | ""
          | "Onsite"
          | "Online"
          | null,
        member_type: invoice.member_type as
          | ""
          | "IEEE Member"
          | "IEEE Non Member"
          | null,
        author_type: invoice.author_type as
          | ""
          | "Author"
          | "Student Author"
          | null,
        amount: invoice.amount,
        date_of_issue: invoice.date_of_issue
          ? new Date(invoice.date_of_issue)
          : null,
        signature_id: invoice.signature_id,
        virtual_account_id: invoice.virtual_account_id,
        bank_transfer_id: invoice.bank_transfer_id,
        created_by: invoice.created_by,
        status: invoice.status,
        created_at: invoice.created_at ? new Date(invoice.created_at) : null,
        updated_at: invoice.updated_at ? new Date(invoice.updated_at) : null,
      });
    } else if (open && !invoice) {
      form.reset({
        invoice_no: `INV-${new Date().getTime().toString().slice(-6)}`,
        loa_id: "",
        institution: null,
        email: null,
        presentation_type: null,
        member_type: null,
        author_type: null,
        amount: null,
        date_of_issue: new Date(),
        signature_id: "",
        virtual_account_id: null,
        bank_transfer_id: null,
        created_by: "",
        status: "Pending",
        created_at: new Date(),
        updated_at: null,
      });
    }
  }, [open, invoice, form]);

  // const createMutation = useMutation({
  //   mutationFn: async (values: InvoiceFormValues) => {
  //     const response = await api.put(invoiceRoutes.updateICODSA("create"), {
  //       ...values,
  //       id: crypto.randomUUID(),
  //     })
  //     return response.data.data
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["icodsa-invoices"] })
  //     if (form.getValues("status") === "Paid") {
  //       queryClient.invalidateQueries({ queryKey: ["icodsa-receipts"] })
  //       toast.success("Invoice created successfully and payment generated")
  //     } else {
  //       toast.success("Invoice created successfully")
  //     }
  //     onOpenChange(false)
  //   },
  //   onError: (error: any) => {
  //     console.error("Error creating invoice:", error)
  //     toast.error(error?.response?.data?.message || "Failed to create invoice")
  //   },
  //   onSettled: () => {
  //     setIsSubmitting(false)
  //   },
  // })

  const updateMutation = useMutation({
    mutationFn: async (values: InvoiceFormValues & { id: string }) => {
      // Format the date to MySQL format (YYYY-MM-DD)
      const formattedValues = {
        ...values,
        created_by: user?.id,
        date_of_issue: values.date_of_issue
          ? values.date_of_issue.toISOString().split("T")[0]
          : null,
      };

      const response = await api.put(
        invoiceRoutes.updateICODSA(values.id),
        formattedValues
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["icodsa-invoices"] });
      if (variables.status === "Paid") {
        queryClient.invalidateQueries({ queryKey: ["icodsa-receipts"] });
        toast.success("Invoice updated successfully and payment generated");
      } else {
        toast.success("Invoice updated successfully");
      }
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Error updating invoice:", error);
      toast.error(error?.response?.data?.message || "Failed to update invoice");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: InvoiceFormValues) {
    setIsSubmitting(true);

    // if (mode === "edit" && invoice) {
    //   updateMutation.mutate({ ...values, id: invoice.id })
    // } else {
    //   createMutation.mutate(values)
    // }
    if (mode === "edit" && invoice) {
      updateMutation.mutate({ ...values, id: invoice.id });
    }
  }

  const isViewMode = mode === "view";
  const title =
    mode === "create"
      ? "Create New Invoice"
      : mode === "edit"
        ? "Edit Invoice"
        : "View Invoice";

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
                name="invoice_no"
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@email.com"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="presentation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presentation Type</FormLabel>
                    <Select
                      disabled={isViewMode}
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? ""}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select presentation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="member_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Type</FormLabel>
                    <Select
                      disabled={isViewMode}
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? ""}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select member type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IEEE Member">IEEE Member</SelectItem>
                        <SelectItem value="IEEE Non Member">
                          IEEE Non Member
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Type</FormLabel>
                    <Select
                      disabled={isViewMode}
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? ""}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select author type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Author">Author</SelectItem>
                        <SelectItem value="Student Author">
                          Student Author
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-4 h-px bg-gray-300" />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="IDR 5xxxxx"
                        type="number"
                        min="0"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loa_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LOA ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="LOA-123"
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="University/Organization"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signature_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Signature reference"
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
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
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {field.value === "Paid" &&
                        "Payment will be automatically created when status is set to Paid"}
                    </p>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_of_issue"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Issue</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isViewMode}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date | undefined}
                          onSelect={field.onChange}
                          disabled={isViewMode}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              {!isViewMode ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                      ? "Create"
                      : "Save changes"}
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
  );
}
