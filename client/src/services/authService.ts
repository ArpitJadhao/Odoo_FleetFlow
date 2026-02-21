import type { UserRole, AuthUser } from '@/types/auth'

/**
 * Base URL for the local Express API.
 * Vite proxies /api → http://localhost:4000
 */
const API = '/api'

/**
 * authService — all auth calls go to local Express + PostgreSQL.
 * No Supabase dependency.
 */
export const authService = {

    /**
     * Sign in — POST /api/auth/login
     * Returns user + JWT token.
     */
    async signIn(email: string, password: string): Promise<AuthUser> {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Login failed.')

        return {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName,
            role: data.user.role as UserRole,
            accessToken: data.token,
        }
    },

    /**
     * Register — POST /api/auth/register
     * Creates user in local PostgreSQL with bcrypt-hashed password.
     */
    async signUp(
        email: string,
        password: string,
        fullName: string,
        role: UserRole
    ): Promise<AuthUser> {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName, role }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Registration failed.')

        return {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName,
            role: data.user.role as UserRole,
            accessToken: data.token,
        }
    },

    /**
     * Restore session — GET /api/auth/me
     * Called on app boot to restore persisted JWT.
     */
    async getSession(): Promise<AuthUser | null> {
        const token = authService.getStoredToken()
        if (!token) return null

        const res = await fetch(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) { authService.clearToken(); return null }

        const data = await res.json()
        return {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName,
            role: data.user.role as UserRole,
            accessToken: token,
        }
    },

    /** Sign out — clear local token */
    async signOut(): Promise<void> {
        authService.clearToken()
    },

    // ── Token helpers ──────────────────────────────────────
    getStoredToken(): string | null {
        try {
            const raw = localStorage.getItem('fleetflow-auth')
            if (!raw) return null
            const parsed = JSON.parse(raw)
            return parsed?.state?.user?.accessToken ?? null
        } catch { return null }
    },

    clearToken(): void {
        localStorage.removeItem('fleetflow-auth')
    },

    /** Forgot password — not applicable for local auth. Shows info message. */
    async forgotPassword(_email: string): Promise<void> {
        throw new Error('Password reset not available in local mode. Contact your administrator.')
    },
}
