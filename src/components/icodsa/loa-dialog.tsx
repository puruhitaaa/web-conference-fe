import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios-config";
import { loaRoutes, signatureRoutes } from "@/api";
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
import { Signature } from "../signature/signature-table";

const formSchema = z.object({
  paper_id: z.string().min(1, "Paper ID is required"),
  paper_title: z.string().min(1, "Conference title is required"),
  author_names: z.union([
    z
      .string()
      .min(1)
      .transform((val) => val.split(",").map((v) => v.trim())),
    z.array(z.string()),
  ]),
  status: z.enum(["Accepted", "Rejected"]),
  tempat_tanggal: z.string().min(1, "Place and date is required"),
  signature_id: z.coerce.string().min(1, "Signature ID is required"),
  theme_conference: z.string().min(1, "theme conference is required"),
  place_date_conference: z.string().min(1, "Place and date is required"),
  created_by: z.number().optional(),
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
      status: "Accepted",
      tempat_tanggal: "",
      signature_id: "",
    },
  });

  useEffect(() => {
    if (open && loa) {
      const status =
        typeof loa.status === "string"
          ? loa.status.toLowerCase() === "accepted"
            ? "Accepted"
            : loa.status.toLowerCase() === "rejected"
              ? "Rejected"
              : "Accepted"
          : "Accepted";

      let authorNames;
      if (typeof loa.author_names === "string") {
        try {
          const parsed = JSON.parse(loa.author_names);
          authorNames = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          authorNames = loa.author_names.split(", ").map((name) => name.trim());
        }
      } else if (Array.isArray(loa.author_names)) {
        authorNames = loa.author_names;
      } else {
        authorNames = [];
      }

      form.reset({
        paper_id: loa.paper_id,
        paper_title: loa.paper_title,
        author_names: authorNames,
        status: status as "Accepted" | "Rejected",
        tempat_tanggal: loa.tempat_tanggal,
        signature_id: loa.signature_id,
        theme_conference: loa.theme_conference,
        place_date_conference: loa.place_date_conference,
      });
    } else if (open && !loa) {
      form.reset({
        paper_id: "",
        paper_title: "",
        author_names: [],
        tempat_tanggal: "",
        status: "Accepted",
        signature_id: "",
        theme_conference: "",
        place_date_conference: "",
      });
    }
  }, [open, loa, form]);

  const { data: signature = [] } = useQuery<Signature[]>({
    queryKey: ["icodsa-signature"],
    queryFn: async () => {
      const response = await api.get(signatureRoutes.list);
      return response.data;
    },
  });

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

      const response = await api.post(loaRoutes.createICODSA, processedValues);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icodsa-loas"] });
      toast.success("LoA created successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error("Failed to create LoA");
      console.error(error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: LoaFormValues & { id: string }) => {
      const response = await api.put(loaRoutes.updateICODSA(values.id), values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icodsa-loas"] });
      toast.success("loa updated successfully");
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
                        placeholder="John Doe, Alex Doe, Yin Doe (max. 5 authors)"
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
                        placeholder="ICODSA 2023"
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
              <FormField
                control={form.control}
                name="theme_conference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conference Theme Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter conference theme name.."
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
                name="place_date_conference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place and Date of Conference</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Jakarta, 12 Dec 2025"
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
                    <Select
                      disabled={isViewMode}
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Signatory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {signature.map((signer) => (
                          <SelectItem
                            key={signer.id}
                            value={signer.id.toString()}
                          >
                            {signer.id} - {signer.nama_penandatangan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
