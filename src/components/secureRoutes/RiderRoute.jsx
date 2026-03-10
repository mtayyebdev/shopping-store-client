import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function RiderRoute({ children }) {
    const { isLoggedIn, authLoading } = useSelector((state) => state.deliveryBoySlice);

    if (authLoading) return null;

    if (!isLoggedIn) {
        return <Navigate to={"/login-rider"} replace />
    }

    return children;
}

export default RiderRoute
