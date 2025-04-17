import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios-config"
import { virtualAccountRoutes } from "@/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { VirtualAccount } from "./virtual-account-table"
import { useAuthStore } from "@/lib/auth/authStore"

const formSchema = z.object({
  nomor_virtual_akun: z.string().min(1, "Account number is required"),
  account_holder_name: z.string().min(1, "Account holder name is required"),
  bank_name: z.string().min(1, "Bank name is required"),
  bank_branch: z.string().min(1, "Bank branch is required"),
})

type VirtualAccountFormValues = z.infer<typeof formSchema>

interface VirtualAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  virtualAccount: VirtualAccount | null
}

export function VirtualAccountDialog({
  open,
  onOpenChange,
  mode,
  virtualAccount,
}: VirtualAccountDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAuthStore((state) => state.user)

  const form = useForm<VirtualAccountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomor_virtual_akun: "",
      account_holder_name: "",
      bank_name: "",
      bank_branch: "",
    },
  })

  useEffect(() => {
    if (open && virtualAccount) {
      form.reset({
        nomor_virtual_akun: virtualAccount.nomor_virtual_akun,
        account_holder_name: virtualAccount.account_holder_name,
        bank_name: virtualAccount.bank_name,
        bank_branch: virtualAccount.bank_branch,
      })
    } else if (open && !virtualAccount) {
      form.reset({
        nomor_virtual_akun: "",
        account_holder_name: "",
        bank_name: "",
        bank_branch: "",
      })
    }
  }, [open, virtualAccount, form])

  const createMutation = useMutation({
    mutationFn: async (values: VirtualAccountFormValues) => {
      const response = await api.post(virtualAccountRoutes.create, {
        ...values,
        created_by: user?.id,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-accounts"] })
      toast.success("Virtual account created successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to create virtual account")
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: VirtualAccountFormValues & { id: string }) => {
      const response = await api.put(
        virtualAccountRoutes.update(values.id),
        values
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-accounts"] })
      toast.success("Virtual account updated successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to update virtual account")
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  function onSubmit(values: VirtualAccountFormValues) {
    setIsSubmitting(true)

    if (mode === "edit" && virtualAccount) {
      updateMutation.mutate({ ...values, id: virtualAccount.id })
    } else {
      createMutation.mutate(values)
    }
  }

  const isViewMode = mode === "view"
  const isSuperAdmin = user?.role === 1
  const title =
    mode === "create"
      ? "Create New Virtual Account"
      : mode === "edit"
        ? "Edit Virtual Account"
        : "View Virtual Account"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new virtual account."
              : mode === "edit"
                ? "Edit the virtual account details."
                : "View virtual account details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='nomor_virtual_akun'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter virtual account number'
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='account_holder_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter account holder name'
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='bank_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter bank name'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bank_branch'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Branch</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter bank branch'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
            </div>

            {!isViewMode && isSuperAdmin && (
              <DialogFooter>
                <Button type='submit' disabled={isSubmitting}>
                  {mode === "create" ? "Create" : "Save Changes"}
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
