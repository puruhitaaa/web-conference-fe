import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { protectedRoutes } from "@/api"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import { Loa } from "./loa-table"

const formSchema = z.object({
  paperId: z.string().min(1, "Paper ID is required"),
  authorName: z.string().min(1, "Author name is required"),
  time: z.string().min(1, "Time is required"),
  conferenceTitle: z.string().min(1, "Conference title is required"),
  placeAndDate: z.string().min(1, "Place and date is required"),
  status: z.enum(["accepted", "rejected"]),
  signature: z.string().min(1, "Signature is required"),
  department: z.string().min(1, "Department is required"),
})

type LoaFormValues = z.infer<typeof formSchema>

interface LoaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  loa: Loa | null
}

export function LoaDialog({ open, onOpenChange, mode, loa }: LoaDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paperId: "",
      authorName: "",
      time: "",
      conferenceTitle: "",
      placeAndDate: "",
      status: "accepted",
      signature: "",
      department: "",
    },
  })

  // Reset form when dialog opens with loa data
  useEffect(() => {
    if (open && loa) {
      form.reset({
        paperId: loa.paperId,
        authorName: loa.authorName,
        time: loa.time,
        conferenceTitle: loa.conferenceTitle,
        placeAndDate: loa.placeAndDate,
        status: loa.status,
        signature: loa.signature,
        department: loa.department,
      })
    } else if (open && !loa) {
      form.reset({
        paperId: "",
        authorName: "",
        time: "",
        conferenceTitle: "",
        placeAndDate: "",
        status: "accepted",
        signature: "",
        department: "",
      })
    }
  }, [open, loa, form])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (values: LoaFormValues) => {
      const response = await axios.post(protectedRoutes.loas, {
        ...values,
        id: crypto.randomUUID(),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icodsa-loas"] })
      toast.success("LoA created successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to create LoA")
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: LoaFormValues & { id: string }) => {
      const response = await axios.put(
        `${protectedRoutes.loas}/${values.id}`,
        values
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icodsa-loas"] })
      toast.success("LoA updated successfully")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to update LoA")
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  function onSubmit(values: LoaFormValues) {
    setIsSubmitting(true)

    if (mode === "edit" && loa) {
      updateMutation.mutate({ ...values, id: loa.id })
    } else {
      createMutation.mutate(values)
    }
  }

  const isViewMode = mode === "view"
  const title =
    mode === "create"
      ? "Create New LoA"
      : mode === "edit"
        ? "Edit LoA"
        : "View LoA"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='paperId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='PP-123'
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
                name='authorName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
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
                name='time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='10:00 AM'
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
                name='conferenceTitle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conference Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='ICODSA 2023'
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
              name='placeAndDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place and Date</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Jakarta, January 1, 2023'
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
                name='status'
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
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='accepted'>Accepted</SelectItem>
                        <SelectItem value='rejected'>Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='department'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Computer Science'
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
              name='signature'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Dr. John Smith'
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              {!isViewMode ? (
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                      ? "Create"
                      : "Save changes"}
                </Button>
              ) : (
                <Button type='button' onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
