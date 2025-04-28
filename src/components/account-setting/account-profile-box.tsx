import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useCredentialsStore, useAuthStore } from "@/lib/auth/authStore";
import toast from "react-hot-toast";
import api from "@/lib/axios-config";
import { adminRoutes } from "@/api";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface PasswordChangeData {
  old_password: string;
  new_password: string;
}

export function UserProfile() {
  const { user, token, tokenType } = useAuthStore();

  const {
    password: currentPassword,
    email,
    setCredentials,
  } = useCredentialsStore();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const roleNames: Record<number, string> = {
    1: "Super Admin",
    2: "Admin ICODSA",
    3: "Admin ICICYTA",
  };

  const getRoleName = (role: number): string =>
    roleNames[role] || "Unknown role";

  const validateOldPassword = (): boolean => {
    if (!currentPassword) {
      toast.error("Password info tidak tersedia. Silakan login ulang");
      return false;
    }

    if (oldPassword !== currentPassword) {
      toast.error("Password lama tidak sesuai");
      return false;
    }

    return true;
  };

  const changePasswordMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      if (!user?.id) {
        throw new Error("User ID tidak ditemukan");
      }

      // Create a dedicated password change API endpoint
      // This is typically more secure than using the general user update endpoint
      const passwordChangeData: PasswordChangeData = {
        old_password: oldPassword,
        new_password: newPassword,
      };

      try {
        // Use a dedicated password change endpoint if available
        const response = await api.post(
          `/auth/change-password`, // Adjust this endpoint based on your API
          passwordChangeData,
          {
            headers: {
              Authorization: `${tokenType} ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        // If dedicated endpoint fails or doesn't exist, fall back to admin update
        console.log("Trying admin update endpoint as fallback...");

        const updateData = {
          password: newPassword,
          old_password: oldPassword, // Some APIs require this for verification
          name: user.name,
          email: email || user.email,
          role: user.role,
        };

        const response = await api.put(
          adminRoutes.updateAdmin(user.id),
          updateData,
          {
            headers: {
              Authorization: `${tokenType} ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      }
    },
    onSuccess: () => {
      // Update credentials in store
      setCredentials(user?.name || "", newPassword);

      toast.success("Password berhasil diubah");
      setOpenDialog(false);
      setOldPassword("");
      setNewPassword("");
    },
    onError: (error: unknown) => {
      console.error("Error changing password:", error);

      // Properly type-check for Axios error
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        console.error("Status:", axiosError.response?.status);
        console.error("Error data:", axiosError.response?.data);

        if (axiosError.response?.status === 403) {
          toast.error(
            "Akses ditolak: Anda tidak memiliki izin untuk mengubah password"
          );
        } else {
          const errorMessage =
            axiosError.response?.data &&
            typeof axiosError.response.data === "object"
              ? (axiosError.response.data as any).message
              : "Unknown error";

          toast.error(
            `Gagal mengubah password: ${errorMessage || axiosError.message}`
          );
        }
      } else {
        // Handle non-Axios errors
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`Gagal mengubah password: ${errorMessage}`);
      }
    },
  });

  // Handle submit password change
  const handleChangePassword = (): void => {
    if (!validateOldPassword()) return;

    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }

    changePasswordMutation.mutate();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Account Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 ">
          <div>
            <p className="text-sm font-semibold mb-2">Username</p>
            <Input value={user.name} disabled />
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Email</p>
            <Input value={email || user.email || "-"} disabled />
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Role</p>
            <Input value={getRoleName(user.role)} disabled />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" className="w-full">
            Upload Signature
          </Button>
          {user.role !== 1 && (
            <Button className="w-full" onClick={() => setOpenDialog(true)}>
              Ganti Password
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Dialog Ganti Password */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ganti Kata Sandi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-semibold">Kata Sandi Lama</p>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Kata Sandi Baru</p>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan kata sandi baru (min. 8 karakter)"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                setOldPassword("");
                setNewPassword("");
              }}
              disabled={changePasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={
                changePasswordMutation.isPending || !oldPassword || !newPassword
              }
            >
              {changePasswordMutation.isPending ? "Menyimpan..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
