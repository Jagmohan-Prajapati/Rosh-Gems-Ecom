import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const AuthLoader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="min-h-screen bg-[#050705] flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin mb-4"></div>
      <p className="font-headline italic text-[#D4AF37] text-xs uppercase tracking-[0.2em]">
        {message}
      </p>
    </div>
  )
}

export const AuthRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoader message="Verifying credentials..." />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <AuthLoader message="Authorized entrance only..." />
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}