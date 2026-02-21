import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET ?? 'fleetflow-local-secret'
const JWT_EXPIRES = '7d'

// ─────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates a new user in local PostgreSQL with bcrypt hash
// ─────────────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password, role } = req.body

    if (!fullName || !email || !password) {
        res.status(400).json({ error: 'fullName, email and password are required.' })
        return
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        res.status(409).json({ error: 'Email already registered.' })
        return
    }

    // Hash password with bcrypt (12 salt rounds)
    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            passwordHash,
            role: role ?? 'dispatcher',
        },
        select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    })

    // Issue JWT
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    )

    res.status(201).json({ user, token })
})

// ─────────────────────────────────────────────────────────
// POST /api/auth/login
// Verifies credentials, returns JWT
// ─────────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' })
        return
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        res.status(401).json({ error: 'Invalid email or password.' })
        return
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
        res.status(401).json({ error: 'Invalid email or password.' })
        return
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    )

    res.json({
        user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
        token,
    })
})

// ─────────────────────────────────────────────────────────
// GET /api/auth/me
// Returns current user from JWT (used on app boot)
// ─────────────────────────────────────────────────────────
router.get('/me', async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided.' })
        return
    }

    try {
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, fullName: true, email: true, role: true },
        })
        if (!user) { res.status(404).json({ error: 'User not found.' }); return }
        res.json({ user })
    } catch {
        res.status(401).json({ error: 'Invalid or expired token.' })
    }
})

export default router
