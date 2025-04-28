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

const formSchema = z.object({
  invoice_no: z.string().min(1, "Invoice number is required"),
  loa_id: z.string().min(1, "LOA ID is required"),
  institution: z.string().nullable(),
  email: z.string().email("Invalid email address").nullable(),
  presentation_type: z.string().nullable(),
  member_type: z.string().nullable(),
  author_type: z.string().nullable(),
  amount: z.number().nullable(),
  date_of_issue: z.date().nullable(),
  signature_id: z.string().min(1, "Signature ID is required"),
  virtual_account_id: z.string().nullable(),
  bank_transfer_id: z.string().nullable(),
  created_by: z.string().min(1, "Created by is required"),
  status: z.enum(["Pending", "Paid"]),
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
        presentation_type: invoice.presentation_type,
        member_type: invoice.member_type,
        author_type: invoice.author_type,
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

  const createMutation = useMutation({
    mutationFn: async (values: InvoiceFormValues) => {
      const response = await api.post(invoiceRoutes.updateICODSA("create"), {
        ...values,
        id: crypto.randomUUID(),
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icodsa-invoices"] });
      toast.success("Invoice created successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to create invoice");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: InvoiceFormValues & { id: string }) => {
      const response = await api.put(
        invoiceRoutes.updateICODSA(values.id),
        values
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icodsa-invoices"] });
      toast.success("Invoice updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update invoice");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: InvoiceFormValues) {
    setIsSubmitting(true);

    if (mode === "edit" && invoice) {
      updateMutation.mutate({ ...values, id: invoice.id });
    } else {
      createMutation.mutate(values);
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
                name="loa_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LOA ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="LOA-123456"
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Other form fields similar to above, you can add inputs for institution, email, amount, etc. */}

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
