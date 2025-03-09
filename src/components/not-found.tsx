function NotFound() {
  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='flex flex-col space-y-2'>
        <img
          alt='404'
          className='h-44 w-auto'
          src='/assets/images/common/404.png'
        />
        <h1 className='text-4xl font-bold'>Stop!</h1>
        <p>Page not found</p>
      </div>
    </div>
  )
}

export default NotFound
