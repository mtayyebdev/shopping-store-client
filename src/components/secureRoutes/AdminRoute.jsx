import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
  const { isLoggedIn, user, loading } = useSelector((state) => state.userSlice);

  if (loading) {
    return null;
  }

  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to={"/"} replace />
  }

  return children;
}

export default AdminRoute
