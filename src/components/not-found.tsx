import { ArrowLeft } from "lucide-react"
import { Link, useRouter } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { Home } from "lucide-react"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"

function NotFound() {
  const isAuthenticated = useIsAuthenticated()
  const router = useRouter()

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center space-y-2'>
        <img
          alt='404'
          className='h-44 w-auto'
          src='/assets/images/common/404.png'
        />

        <div>
          <h1 className='text-4xl font-bold'>Stop!</h1>
          <p>Page not found</p>
        </div>

        <div className='flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0'>
          {isAuthenticated && (
            <Button variant='outline' size='lg' asChild>
              <Link to='/' search={{}} params={{}}>
                <Home className='mr-2 h-4 w-4' />
                Go to Home
              </Link>
            </Button>
          )}

          <Button
            variant='default'
            size='lg'
            onClick={() => router.history.back()}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
