/** RBAC role values */
export type UserRole = 'manager' | 'dispatcher' | 'safety' | 'finance'

/** Authenticated user shape shared across client */
export interface AuthUser {
    id: string
    email: string
    fullName: string
    role: UserRole
    accessToken: string
}

/** Zustand auth store state */
export interface AuthState {
    user: AuthUser | null
    isLoading: boolean
    isAuthenticated: boolean
    setUser: (user: AuthUser | null) => void
    setLoading: (loading: boolean) => void
    clearAuth: () => void
}
