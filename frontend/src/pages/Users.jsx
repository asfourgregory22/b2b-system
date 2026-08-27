import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Users() {
    const [ users, setUsers ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState('')

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem('token')
                const response = await fetch('http://localhost:3000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                })

                const data = await response.json()

                if (data.status !== 'success') {
                    setError(data.message)
                    return
                }

                setUsers(data.data.users)

            } catch (err) {
                console.error(err)
                setError('Failed to load users')
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        <Link to={`/users/${user._id}`}>
                            {user.name} — {user.email} — {user.role} — {user.isActive ? 'Active' : 'Inactive'}
                        </Link>    
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Users