import { useState } from 'react'
import { Outlet , Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Layout() {
    const [ isOpen , setIsOpen ] = useState(true)
    const { user } = useAuth()

    return (
        <div>
            <button onClick = {() => setIsOpen(!isOpen) }>
                ☰
            </button>

            {isOpen && (
                <nav>
                    <ul>
                     <li><Link to="/dashboard"  >Dashboard</Link></li>
                     <li><Link to="items"       >Items</Link></li>
                     <li><Link to="orders"      >Orders</Link></li>
                     {user.role !== 'customer' && (
                        <li><Link to="users"       >Users</Link></li>
                     )}
                </ul>
                </nav>
            )}

            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default Layout