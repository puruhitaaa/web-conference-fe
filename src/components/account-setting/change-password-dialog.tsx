import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { adminAccounts } from "@/api/adminAccount";
import api from "@/lib/axios-config";

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AccountPasswordUsersValues = z.infer<typeof formSchema>;

type LocalAcc = {
  id: string | number;
  name: string;
  username: string;
  email: string;
  role: "icodsa" | "icicyta";
};

interface PasswordUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "edit";
  userAccount: LocalAcc | null;
}

export function AccountUpdateDialog({
  open,
  onOpenChange,
  userAccount,
}: PasswordUsersDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AccountPasswordUsersValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ password: "" });
    }
  }, [open, userAccount, form]);

  const updatePassword = useMutation({
    mutationFn: async (values: AccountPasswordUsersValues) => {
      if (!userAccount) return;

      let endpoint: string;
      switch (userAccount.role) {
        case "icodsa":
          endpoint = adminAccounts.updatePasswordICODSA(userAccount.id);
          console.log("endpoint for user 4", endpoint);
          break;
        case "icicyta":
          endpoint = adminAccounts.updatePasswordICICYTA(userAccount.id);
          console.log("endpoint for user 4", endpoint);
          break;
        default:
          throw new Error("Unknown role");
      }

      const res = await api.put(endpoint, {
        password: values.password,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts-password"] });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Failed to update password:", error);
    },
  });

  const onSubmit = (values: AccountPasswordUsersValues) => {
    setIsSubmitting(true);
    updatePassword.mutate(values, {
      onSettled: () => setIsSubmitting(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter a new password for the user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
