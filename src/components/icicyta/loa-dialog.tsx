import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios-config";
import { loaRoutes } from "@/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { Loa } from "./loa-table";

const formSchema = z.object({
  paper_id: z.string().min(1, "Paper ID is required"),
  paper_title: z.string().min(1, "Conference title is required"),
  author_names: z
    .string()
    .min(1)
    .transform((val) => val.split(",").map((v) => v.trim())),
  status: z.enum(["Accepted", "Rejected"]),
  tempat_tanggal: z.string().min(1, "Place and date is required"),
  signature_id: z.string().min(1).transform(Number),
  created_by: z.number().optional(), // Added to match backend schema
});

type LoaFormValues = z.infer<typeof formSchema>;

interface LoaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  loa: Loa | null;
}

export function LoaDialog({ open, onOpenChange, mode, loa }: LoaDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paper_id: "",
      paper_title: "",
      author_names: ["Dr. Abdi", "Prof. Samu", "Dr. Alex"],
      status: "Accepted", // Make sure this is uppercase
      tempat_tanggal: "",
      signature_id: 0,
    },
  });

  useEffect(() => {
    if (open && loa) {
      // Ensure status is properly capitalized when loading from existing loa
      const status =
        typeof loa.status === "string"
          ? loa.status.toLowerCase() === "accepted"
            ? "Accepted"
            : loa.status.toLowerCase() === "rejected"
              ? "Rejected"
              : "Accepted" // Default to Accepted if unknown
          : "Accepted";

      // Handle author_names which is JSON in the backend - could be string or array
      let authorNames;
      if (typeof loa.author_names === "string") {
        try {
          // Try to parse if it's JSON string
          const parsed = JSON.parse(loa.author_names);
          authorNames = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // If parsing fails, split by comma
          authorNames = loa.author_names.split(",").map((name) => name.trim());
        }
      } else if (Array.isArray(loa.author_names)) {
        // Already an array
        authorNames = loa.author_names;
      } else {
        // Fallback
        authorNames = [];
      }

      form.reset({
        paper_id: loa.paper_id,
        paper_title: loa.paper_title,
        author_names: authorNames,
        status: status as "Accepted" | "Rejected",
        tempat_tanggal: loa.tempat_tanggal,
        signature_id: loa.signature_id,
      });
    } else if (open && !loa) {
      form.reset({
        paper_id: "",
        paper_title: "ICICYTA 2023",
        author_names: [],
        tempat_tanggal: "",
        status: "Accepted",
        signature_id: undefined,
      });
    }
  }, [open, loa, form]);

  const createMutation = useMutation({
    mutationFn: async (values: LoaFormValues) => {
      const userId = localStorage.getItem("userId") || "1";

      const processedValues = {
        ...values,
        author_names: Array.isArray(values.author_names)
          ? values.author_names
          : values.author_names,
        created_by: parseInt(userId),
      };

      const response = await api.post(loaRoutes.createICICYTA, processedValues);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icicyta-loas"] });
      toast.success("LoA created successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to create LoA");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: LoaFormValues & { id: string }) => {
      const userId = localStorage.getItem("userId") || "1";

      const processedValues = {
        ...values,
        author_names: Array.isArray(values.author_names)
          ? values.author_names
          : values.author_names,
        created_by: parseInt(userId),
      };

      const response = await api.put(
        loaRoutes.updateICICYTA(values.id),
        processedValues
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Force a complete refetch of the data instead of just invalidating
      queryClient.invalidateQueries({ queryKey: ["icicyta-loas"] });

      // Optionally, update the cache with the returned data to avoid flickering
      // This assumes your API returns the updated record
      try {
        const previousData = queryClient.getQueryData<Array<Loa>>([
          "icicyta-loas",
        ]);
        if (previousData) {
          const updatedData = previousData.map((item) =>
            item.id === data.id ? data : item
          );
          queryClient.setQueryData(["icicyta-loas"], updatedData);
        }
      } catch (error) {
        console.error("Error updating cache:", error);
        // If updating the cache fails, we still have the invalidation as fallback
      }

      toast.success("LoA updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update LoA");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: LoaFormValues) {
    setIsSubmitting(true);

    if (mode === "edit" && loa) {
      updateMutation.mutate({ ...values, id: loa.id });
    } else {
      createMutation.mutate(values);
    }
  }

  const isViewMode = mode === "view";
  const title =
    mode === "create"
      ? "Create New LoA"
      : mode === "edit"
        ? "Edit LoA"
        : "View LoA";

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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paper_id"
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author_names"
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paper_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conference Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ICICYTA 2023"
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
                name="tempat_tanggal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place and Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jakarta, 1 January 2023"
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signature_id"
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
