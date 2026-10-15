import React from 'react'
import { useAuth } from '../context/AuthContent'
import { Navigate } from 'react-router-dom'

function PublicRoute({children}) {
    const { customer } = useAuth()

    if(customer) {
        return <Navigate to='/home' replace />
    }

  return (
    <div>
        {children}
    </div>
  )
}

export default PublicRoute
