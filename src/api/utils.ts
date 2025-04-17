export const constructUrl = (
  baseUrl: string,
  params: Record<string, string>
) => {
  const url = new URL(baseUrl, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })
  return url.toString()
}
