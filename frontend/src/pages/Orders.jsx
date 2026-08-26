import { useState , useEffect } from 'react'
import { useAuth } from '../context/useAuth'

function Orders(){
    const { user } = useAuth()
    const [ orders , setOrders ] = useState([])
    const [ loading , setLoading ] = useState(true)
    const [ error , setError ] = useState('')


    useEffect(() => {
        async function fetchOrders(){
            try{
                const token = localStorage.getItem('token')

                const url = user.role === 'customer'
                    ? 'http://localhost:3000/api/orders/mine'
                    : 'http://localhost:3000/api/orders'       

                

                const response = await fetch(url, {
                  headers: { Authorization: `Bearer ${token}` }
                })

                const data = await response.json()

                if (data.status !== 'success'){
                    setError(data.message)
                    return
                }

                setOrders(data.data.orders)

            }catch(err){
                console.error(err)
                setError('Failed to load orders')
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [user.role]) 
    
    if (loading) return <p>Loading...</p>
    if (error) return <p>{ error }</p>

    return (
        <div>
            <h1>Orders</h1>
            <ul>
                {orders.map((order) =>(
                    <li key = {order._id}>
                         Order #{order._id.slice(-6)} — Customer: {order.customerId.name} — Status: {order.status} — Total: ${order.totalAmount}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Orders