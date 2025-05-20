import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import api from "@/lib/axios-config";
import { signatureRoutes } from "@/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { Signature } from "./signature-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth/authStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const signatureSchema = z.object({
  picture: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files.length === 1,
      "Only one file is allowed"
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
      },
      { message: "File must be jpg, jpeg, or png" }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        return file.size <= 2 * 1024 * 1024;
      },
      { message: "Max file size is 2MB" }
    ),
  nama_penandatangan: z.string().min(1, "Required"),
  jabatan_penandatangan: z.string().min(1, "Required"),
  tanggal_dibuat: z.string().optional(),
});

type SignatureFormData = z.infer<typeof signatureSchema>;

interface SignatureUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  signatureUser: Signature | null;
}

export function SignatureUploadDialog({
  open,
  onOpenChange,
  mode,
  signatureUser,
}: SignatureUploadDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  const form = useForm<SignatureFormData>({
    resolver: zodResolver(signatureSchema),
    defaultValues: {
      picture: "",
      nama_penandatangan: "",
      jabatan_penandatangan: "",
      tanggal_dibuat: "",
    },
  });

  useEffect(() => {
    if (open && signatureUser) {
      form.reset({
        picture: signatureUser.picture,
        nama_penandatangan: signatureUser.nama_penandatangan,
        jabatan_penandatangan: signatureUser.jabatan_penandatangan,
        tanggal_dibuat: signatureUser.tanggal_dibuat,
      });
    } else if (open && !signatureUser) {
      form.reset({
        picture: "",
        nama_penandatangan: "",
        jabatan_penandatangan: "",
        tanggal_dibuat: "",
      });
    }
  }, [open, signatureUser, form]);

  const createMutation = useMutation({
    mutationFn: async (values: SignatureFormData) => {
      // Create FormData object for file upload
      const formData = new FormData();

      // Add file to FormData if it exists
      if (values.picture && values.picture[0]) {
        formData.append("picture", values.picture[0]);
      }

      // Add other form fields
      formData.append("nama_penandatangan", values.nama_penandatangan);
      formData.append("jabatan_penandatangan", values.jabatan_penandatangan);
      if (values.tanggal_dibuat) {
        formData.append("tanggal_dibuat", values.tanggal_dibuat);
      }

      // Add user ID if available
      if (user?.id) {
        formData.append("created_by", user.id.toString());
      }

      console.log("Submitting form data:", Object.fromEntries(formData));

      // Post with correct headers for FormData
      const response = await api.post(signatureRoutes.create, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signature-users"] });
      toast.success("Signature created successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Creation error:", error);
      toast.error("Failed to create signature");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: SignatureFormData & { id: string }) => {
      // Create FormData object for file upload
      const formData = new FormData();

      // Add file to FormData if it exists
      if (values.picture && values.picture[0] instanceof File) {
        formData.append("picture", values.picture[0]);
      }

      // Add other form fields
      formData.append("nama_penandatangan", values.nama_penandatangan);
      formData.append("jabatan_penandatangan", values.jabatan_penandatangan);
      if (values.tanggal_dibuat) {
        formData.append("tanggal_dibuat", values.tanggal_dibuat);
      }

      console.log("Updating with form data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("Updating with form data:", Object.fromEntries(formData));

      // Put with correct headers for FormData
      const response = await api.post(
        signatureRoutes.update(values.id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signature-users"] });
      toast.success("Signature updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error("Failed to update signature");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: SignatureFormData) {
    setIsSubmitting(true);
    console.log("Form values:", values);

    if (mode == "edit" && signatureUser) {
      updateMutation.mutate({ ...values, id: signatureUser.id });
    } else {
      createMutation.mutate(values);
    }
  }

  const isViewMode = mode === "view";
  const isSuperAdmin = user?.role === 1;
  const title =
    mode === "create"
      ? "Create New Signature"
      : mode === "edit"
        ? "Edit Signature"
        : "View Signature";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create new signature"
              : mode === "edit"
                ? "Edit the signature details"
                : "View signature details"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nama_penandatangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signatory Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prof. Ahmed"
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
              name="jabatan_penandatangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signatory's Position</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Signatory Position (ex: Rector)"
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
              name="picture"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Upload Signature</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        onChange(e.target.files);
                      }}
                      {...fieldProps}
                      disabled={isViewMode}
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {!isViewMode && isSuperAdmin && (
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {mode === "create" ? "Create" : "Save Changes"}
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
