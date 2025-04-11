import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminRoutes } from "@/api";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

import { useAuthStore } from "@/lib/auth/authStore";
import api from "@/lib/axios-config";
import { AccountUsers } from "./accounts-table";

const formSchema = z.object({
  name: z.string().min(2, "name is required"),
  username: z.string().min(2, "username is required"),
  email: z.string().email("please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["icicyta", "icodsa"], {
    required_error: "please selecet admin type",
  }),
});

type AccountUsersFormValues = z.infer<typeof formSchema>;

interface AccountUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  userAccount: AccountUsers | null;
}

export function AccountUserDialog({
  open,
  onOpenChange,
  mode,
  userAccount,
}: AccountUsersDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  const form = useForm<AccountUsersFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: "icicyta",
    },
  });

  useEffect(() => {
    if (open && userAccount) {
      const validRole =
        userAccount.role === "icicyta" || userAccount.role === "icodsa"
          ? userAccount.role
          : "icicyta";

      form.reset({
        name: userAccount.name ?? "",
        username: userAccount.username,
        email: userAccount.email,
        password: "",
        role: validRole,
      });
    } else if (open && !userAccount) {
      form.reset({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "icicyta",
      });
    }
  }, [open, userAccount, form]);

  const createMutation = useMutation({
    mutationFn: async (values: AccountUsersFormValues) => {
      const role_id = values.role === "icicyta" ? 2 : 3; // misalnya role_id untuk icicyta = 2, icodsa = 3
      const endpoint =
        values.role === "icicyta"
          ? adminRoutes.createAdminICICYTA
          : adminRoutes.createAdminICODSA;

      const response = await api.post(endpoint, {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        role_id: role_id,
      });
      console.log(response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-management"] });
      toast.success("user account created successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to create user account");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: AccountUsersFormValues & { id: string }) => {
      const response = await api.put(
        adminRoutes.updateAdmin(values.id),
        values
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-management"] });
      toast.success("user account updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update user account");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: AccountUsersFormValues) {
    setIsSubmitting(true);

    if (mode === "edit" && userAccount) {
      updateMutation.mutate({ ...values, id: userAccount.id });
    } else {
      createMutation.mutate(values);
    }
  }

  const isViewMode = mode === "view";
  const isSuperAdmin = user?.role === 1;
  const title =
    mode === "create"
      ? "Add Account"
      : mode === "edit"
        ? "Edit Account"
        : "View Account";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new bank transfer."
              : mode === "edit"
                ? "Edit the bank transfer details."
                : "View bank transfer details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full name"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Type</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isViewMode}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Admin Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="icicyta">ICICYTA</SelectItem>
                        <SelectItem value="icodsa">ICODSA</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
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
