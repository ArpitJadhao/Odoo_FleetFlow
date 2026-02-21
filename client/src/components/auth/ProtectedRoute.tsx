import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types/auth'

interface ProtectedRouteProps {
    children: React.ReactNode
    /** If specified, only users with this role (or array of roles) can access */
    allowedRoles?: UserRole | UserRole[]
}

/**
 * ProtectedRoute — wraps any route that requires authentication.
 *
 * Redirect rules:
 *  - Not logged in → /login
 *  - Wrong role    → /unauthorized
 *  - OK            → render children
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
}) => {
    const { isAuthenticated, user, isLoading } = useAuthStore()
    const location = useLocation()

    // While session is being restored, show nothing (prevents flash)
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles) {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
        if (!roles.includes(user.role)) {
            return <Navigate to="/unauthorized" replace />
        }
    }

    return <>{children}</>
}
