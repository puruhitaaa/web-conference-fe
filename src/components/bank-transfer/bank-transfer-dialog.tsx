import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bankTransferRoutes } from "@/api"
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
import { BankTransfer } from "./bank-transfer-table"
import { useAuthStore } from "@/lib/auth/authStore"
import api from "@/lib/axios-config"

const formSchema = z.object({
  nama_bank: z.string().min(1, "Bank name is required"),
  swift_code: z.string().min(1, "SWIFT code is required"),
  recipient_name: z.string().min(1, "Recipient name is required"),
  beneficiary_bank_account_no: z.string().min(1, "Account number is required"),
  bank_branch: z.string().min(1, "Bank branch is required"),
  bank_address: z.string().min(1, "Bank address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
})

type BankTransferFormValues = z.infer<typeof formSchema>

interface BankTransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  bankTransfer: BankTransfer | null
}

export function BankTransferDialog({
  open,
  onOpenChange,
  mode,
  bankTransfer,
}: BankTransferDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAuthStore((state) => state.user)

  const form = useForm<BankTransferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_bank: "",
      swift_code: "",
      recipient_name: "",
      beneficiary_bank_account_no: "",
      bank_branch: "",
      bank_address: "",
      city: "",
      country: "",
    },
  })

  // Reset form when dialog opens with bank transfer data
  useEffect(() => {
    if (open && bankTransfer) {
      form.reset({
        nama_bank: bankTransfer.nama_bank,
        swift_code: bankTransfer.swift_code,
        recipient_name: bankTransfer.recipient_name,
        beneficiary_bank_account_no: bankTransfer.beneficiary_bank_account_no,
        bank_branch: bankTransfer.bank_branch,
        bank_address: bankTransfer.bank_address,
        city: bankTransfer.city,
        country: bankTransfer.country,
      })
    } else if (open && !bankTransfer) {
      form.reset({
        nama_bank: "",
        swift_code: "",
        recipient_name: "",
        beneficiary_bank_account_no: "",
        bank_branch: "",
        bank_address: "",
        city: "",
        country: "",
      })
    }
  }, [open, bankTransfer, form])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (values: BankTransferFormValues) => {
      const response = await api.post(bankTransferRoutes.create, {
        ...values,
        created_by: user?.id,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-transfers"] })
      toast.success("Bank transfer created successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to create bank transfer")
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: BankTransferFormValues & { id: string }) => {
      const response = await api.put(
        bankTransferRoutes.update(values.id),
        values
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-transfers"] })
      toast.success("Bank transfer updated successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to update bank transfer")
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  function onSubmit(values: BankTransferFormValues) {
    setIsSubmitting(true)

    if (mode === "edit" && bankTransfer) {
      updateMutation.mutate({ ...values, id: bankTransfer.id })
    } else {
      createMutation.mutate(values)
    }
  }

  const isViewMode = mode === "view"
  const isSuperAdmin = user?.role === 1
  const title =
    mode === "create"
      ? "Create New Bank Transfer"
      : mode === "edit"
        ? "Edit Bank Transfer"
        : "View Bank Transfer"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='nama_bank'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Bank Name'
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
                name='swift_code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SWIFT Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='SWIFT Code'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='recipient_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Recipient Name'
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
              name='beneficiary_bank_account_no'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Account Number'
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='bank_branch'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Branch</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Bank Branch'
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
                name='bank_address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Bank Address'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='City'
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
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Country'
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
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
