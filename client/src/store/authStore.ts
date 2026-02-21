import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, AuthUser } from '@/types/auth'

/**
 * Global auth store (persisted to localStorage).
 * Zustand + persist middleware keeps session alive on refresh.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,

            setUser: (user: AuthUser | null) =>
                set({ user, isAuthenticated: !!user, isLoading: false }),

            setLoading: (isLoading: boolean) => set({ isLoading }),

            clearAuth: () =>
                set({ user: null, isAuthenticated: false, isLoading: false }),
        }),
        {
            name: 'fleetflow-auth', // localStorage key
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
)
