import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export type UserRole = 'manager' | 'dispatcher' | 'safety' | 'finance'

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string
        email: string
        role: UserRole
    }
}

interface LocalJwtPayload {
    id: string
    email: string
    role: UserRole
    iat: number
    exp: number
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'fleetflow-local-secret'

/**
 * requireAuth — verifies local JWT issued by Express auth routes.
 * Attaches { id, email, role } to req.user.
 */
export const requireAuth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No authorization token provided.' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as LocalJwtPayload
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role }
        next()
    } catch (err) {
        console.warn('[Auth] JWT verification failed:', (err as Error).message)
        res.status(401).json({ error: 'Invalid or expired token.' })
    }
}

/**
 * requireRole — RBAC gate, applied after requireAuth.
 * Usage: router.get('/route', requireAuth, requireRole('manager'), handler)
 */
export const requireRole = (...roles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        const userRole = req.user?.role
        if (!userRole || !roles.includes(userRole)) {
            res.status(403).json({ error: `Access denied. Required: ${roles.join(', ')}` })
            return
        }
        next()
    }
}
