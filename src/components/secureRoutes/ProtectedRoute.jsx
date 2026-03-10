import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const { isLoggedIn, loading } = useSelector((state) => state.userSlice);

    if (loading) {
        return null;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />
    }

    return children;
}

export default ProtectedRoute
