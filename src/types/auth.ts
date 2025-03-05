export interface AuthState {
  user: User | null
}

export interface User {
  id: string
  name: string
  email: string
}
