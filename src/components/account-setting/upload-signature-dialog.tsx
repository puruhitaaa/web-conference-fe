import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

import api from "@/lib/axios-config";
import { signatureRoutes } from "@/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

const signatureSchema = z.object({
  picture: z
    .any()
    .refine((files) => files?.length === 1, "File is required")
    .refine(
      (files) => {
        const file = files?.[0];
        return (
          file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
        );
      },
      { message: "File must be jpg, jpeg, or png" }
    )
    .refine((files) => files?.[0]?.size <= 2 * 1024 * 1024, {
      message: "Max file size is 2MB",
    }),

  nama_penandatangan: z.string().min(1, "Required"),
  jabatan_penandatangan: z.string().min(1, "Required"),
  tanggal_dibuat: z.string().optional(),
});

type SignatureFormData = z.infer<typeof signatureSchema>;

interface SignatureUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignatureUploadDialog({
  open,
  onOpenChange,
}: SignatureUploadDialogProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignatureFormData>({
    resolver: zodResolver(signatureSchema),
  });

  const onSubmit = async (data: SignatureFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const file = data.picture[0];

      formData.append("picture", file);
      formData.append("nama_penandatangan", data.nama_penandatangan);
      formData.append("jabatan_penandatangan", data.jabatan_penandatangan);
      if (data.tanggal_dibuat) {
        formData.append("tanggal_dibuat", data.tanggal_dibuat);
      }

      await api.post(signatureRoutes.create, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onOpenChange(false);
      reset();
      alert("Signature uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Signature</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Picture (jpg, png, max 2MB)
            </label>
            <Input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              {...register("picture")}
            />
            {errors.picture && (
              <p className="text-sm text-red-500">
                {(errors.picture?.message as string) ?? ""}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Nama Penandatangan
            </label>
            <Input type="text" {...register("nama_penandatangan")} />
            {errors.nama_penandatangan && (
              <p className="text-sm text-red-500">
                {errors.nama_penandatangan.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Jabatan Penandatangan
            </label>
            <Input type="text" {...register("jabatan_penandatangan")} />
            {errors.jabatan_penandatangan && (
              <p className="text-sm text-red-500">
                {errors.jabatan_penandatangan.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Tanggal Dibuat (opsional)
            </label>
            <Input type="date" {...register("tanggal_dibuat")} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
