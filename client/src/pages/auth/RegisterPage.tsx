import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, User, Mail, Lock, Eye, EyeOff, AlertCircle, ChevronDown } from 'lucide-react'
import { authService } from '@/services/authService'
import type { UserRole } from '@/types/auth'

const ROLES: { label: string; value: UserRole }[] = [
    { label: 'Manager', value: 'manager' },
    { label: 'Dispatcher', value: 'dispatcher' },
    { label: 'Safety', value: 'safety' },
    { label: 'Finance', value: 'finance' },
]

/**
 * RegisterPage — matches wireframe right card:
 *  • Logo (circle = truck icon)
 *  • Full form: Full name, email, password, confirm password, role
 *  • Register button
 */
const RegisterPage: React.FC = () => {
    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [role, setRole] = useState<UserRole>('dispatcher')
    const [showPw, setShowPw] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showRoleDD, setShowRoleDD] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fullName || !email || !password || !confirm) {
            setError('All fields are required.')
            return
        }
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }
        setLoading(true)
        setError(null)
        try {
            await authService.signUp(email, password, fullName, role)
            setSuccess(true)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-10 text-center max-w-sm w-full shadow-2xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mx-auto mb-4">
                        <Truck size={28} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
                    <p className="text-slate-400 text-sm mb-6">Check your email to confirm your account before logging in.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 rounded-xl"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(99,179,237,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative w-full max-w-md z-10">
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-black/60">

                    {/* Role selector badge */}
                    <div className="absolute top-4 right-4">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowRoleDD(!showRoleDD)}
                                className="flex items-center gap-1 bg-blue-600/20 border border-blue-500/40 text-blue-400
                           text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-blue-600/30 transition-colors"
                            >
                                {ROLES.find(r => r.value === role)?.label}
                                <ChevronDown size={12} className={`transition-transform ${showRoleDD ? 'rotate-180' : ''}`} />
                            </button>
                            {showRoleDD && (
                                <div className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 min-w-[130px] overflow-hidden">
                                    {ROLES.map((r) => (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => { setRole(r.value); setShowRoleDD(false) }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                        ${role === r.value
                                                    ? 'bg-blue-600/30 text-blue-400 font-semibold'
                                                    : 'text-slate-300 hover:bg-slate-700'}`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700
                            flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
                            <Truck size={28} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
                        <p className="text-slate-400 text-sm mt-1">Join FleetFlow — fill in your details below</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                            <AlertCircle size={16} className="text-red-400 shrink-0" />
                            <span className="text-red-400 text-sm">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-3.5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="John Driver"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5
                             text-sm text-slate-100 placeholder-slate-500 focus:outline-none
                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5
                             text-sm text-slate-100 placeholder-slate-500 focus:outline-none
                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-11 py-2.5
                             text-sm text-slate-100 placeholder-slate-500 focus:outline-none
                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    placeholder="Re-enter password"
                                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-11 py-2.5
                             text-sm text-slate-100 placeholder-slate-500 focus:outline-none
                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Register button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400
                         text-white font-semibold py-3 rounded-xl transition-all duration-200
                         shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 mt-1"
                        >
                            {loading
                                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : 'Register'}
                        </button>
                    </form>

                    <div className="mt-5 pt-4 border-t border-slate-800 text-center">
                        <button onClick={() => navigate('/login')}
                            className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
                            Already have an account? <span className="text-blue-400 font-medium">Sign in</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
