export interface AuthState {
  user: User | null
}

export interface User {
  id: number
  name: string
  email: string
  role: number
}
