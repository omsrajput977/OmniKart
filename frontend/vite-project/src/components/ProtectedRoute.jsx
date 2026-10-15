import React from 'react'
import { useAuth } from '../context/AuthContent'
import { Navigate } from 'react-router-dom'

function ProtectedRoute ({ children }) {
    const { customer } = useAuth()
    // console.log(customer)

    if(!customer) {
        return <Navigate to='/login' replace />
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default ProtectedRoute
