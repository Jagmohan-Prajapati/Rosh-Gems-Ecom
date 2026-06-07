import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const AuthRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050705] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin mb-4"></div>
        <p className="font-headline italic text-[#D4AF37] text-xs uppercase tracking-[0.2em]">Verifying credentials...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050705] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin mb-4"></div>
        <p className="font-headline italic text-[#D4AF37] text-xs uppercase tracking-[0.2em]">Authorized Entrance Only...</p>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
