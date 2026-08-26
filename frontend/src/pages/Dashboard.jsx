import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const { user , logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user.name}</p>
            <p>Role : {user.role}</p>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    )
}

export default Dashboard