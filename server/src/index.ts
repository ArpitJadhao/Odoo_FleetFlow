import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import { requireAuth, requireRole } from './middleware/authMiddleware'
import type { AuthenticatedRequest } from './middleware/authMiddleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 4000

// ─────────────────────────────────────────────────────────
// GLOBAL MIDDLEWARE
// ─────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

// ─────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────

// Health check (public)
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'FleetFlow API', timestamp: new Date().toISOString() })
})

// Auth routes (register, login, me) — public
app.use('/api/auth', authRoutes)

// Protected stubs — will be replaced by real routers per page
app.get('/api/dashboard', requireAuth, requireRole('manager'),
    (_req, res) => res.json({ message: 'Dashboard — manager only' }))

app.get('/api/trips', requireAuth, requireRole('manager', 'dispatcher'),
    (_req, res) => res.json({ message: 'Trips data' }))

app.get('/api/drivers', requireAuth, requireRole('manager', 'safety'),
    (_req, res) => res.json({ message: 'Drivers data' }))

app.get('/api/analytics', requireAuth, requireRole('manager', 'finance'),
    (_req: AuthenticatedRequest, res) => res.json({ message: 'Analytics data' }))

// ─────────────────────────────────────────────────────────
// START
// ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 FleetFlow API → http://localhost:${PORT}`)
    console.log(`   POST /api/auth/register`)
    console.log(`   POST /api/auth/login`)
    console.log(`   GET  /api/auth/me`)
})

export default app
