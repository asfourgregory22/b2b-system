import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from "../context/useAuth"

function ProtectedRoute() {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default ProtectedRoute