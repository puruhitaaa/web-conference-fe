import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import api from "@/lib/axios-config"
import toast from "react-hot-toast"
import { authRoutes } from "@/api"
import { useMutation } from "@tanstack/react-query"
import { Logo } from "../ui/logo"
import { useState } from "react"
import { useAuthStore } from "@/lib/auth/authStore"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const loginAction = useAuthStore((state) => state.login)
  const navigate = useNavigate({ from: "/login" })

  const loginMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      api.post(authRoutes.login, values),
    onSuccess: (res) => {
      if (res.status === 200) {
        console.log("Login response:", res.data)

        const loginSuccess = loginAction(
          res.data.token,
          res.data.token_type,
          res.data.user
        )

        if (loginSuccess) {
          toast.success(res.data.message || "Login successful")
          navigate({
            to: "/",
            replace: true,
            ignoreBlocker: true,
          })
        } else {
          toast.error("Failed to authenticate")
        }
      }
    },
    onError: (error) => {
      console.error("Login error:", error)
      toast.error("Login failed")
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(values)
  }

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-lg", className)}
      {...props}
    >
      <Logo className='mx-auto' />
      <Card className='md:min-w-lg w-full md:w-[initial]'>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-6'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' {...field} />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center'>
                      <FormLabel>Password</FormLabel>
                      <a
                        href='#'
                        className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type='button'
                          className='absolute inset-y-0 right-3 flex items-center text-gray-500'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
