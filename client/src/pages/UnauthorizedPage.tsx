import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'

/**
 * UnauthorizedPage — shown when a role tries to access a restricted route.
 */
const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="text-center max-w-sm">
                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                    <ShieldOff size={36} className="text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-slate-400 text-sm mb-6">You don't have permission to view this page.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-6 py-2.5 rounded-xl transition-colors text-sm"
                >
                    Go Back
                </button>
            </div>
        </div>
    )
}

export default UnauthorizedPage
