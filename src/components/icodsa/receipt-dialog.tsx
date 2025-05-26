import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios-config";
import { paymentRoutes } from "@/api";
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
import { Receipt } from "./receipt-table";

const formSchema = z.object({
  received_from: z.string().min(1, "sender is required"),
});

type ReceiptFormValues = z.infer<typeof formSchema>;

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  receipt: Receipt | null;
}

export function ReceiptDialog({
  open,
  onOpenChange,
  mode,
  receipt,
}: ReceiptDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      received_from: "",
    },
  });

  useEffect(() => {
    if (open && receipt) {
      form.reset({
        received_from: receipt.received_from,
      });
    } else if (open && !receipt) {
      form.reset({
        received_from: "",
      });
    }
  }, [open, receipt, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: ReceiptFormValues & { id: string }) => {
      const response = await api.put(
        paymentRoutes.updateICODSA(values.id),
        values
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icodsa-receipt"] });
      toast.success("receipt updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update receipt");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: ReceiptFormValues) {
    setIsSubmitting(true);

    if (mode === "edit" && receipt)
      return updateMutation.mutate({ ...values, id: receipt.id });
  }

  const isViewMode = mode === "view";
  const title = mode === "edit" ? "Edit Receipt" : "View Receipt";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new Letter of Acceptance."
              : mode === "edit"
                ? "Edit the Letter of Acceptance details."
                : "View Letter of Acceptance details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="received_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Received From</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="sender/payer"
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

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
