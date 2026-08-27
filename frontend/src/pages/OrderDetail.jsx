import { useState , useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'


function OrderDetail() {
    const { id } = useParams()
    const { user } = useAuth()
    const [ order , setOrder ] = useState(null)
    const [ loading , setLoading ] = useState(true)
    const [ error , setError ] = useState('')

    useEffect(() => {
        async function fetchOrders(){
            try{
                const token = localStorage.getItem('token')

                const url = `http://localhost:3000/api/orders/${id}`

                const response = await fetch (url , {
                    headers : { Authorization : `Bearer ${token}`}
                })

                const data = await response.json()

                if ( data.status !== 'success' ){
                    setError(data.message)
                    return
                }

                setOrder(data.data.order)

            }catch(err){
                console.error(err)
                setError('Failed to load the order')
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [id] )

    async function handleApprove() {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3000/api/orders/${id}/approve`,{
            method : 'PATCH',
            headers : { Authorization : `Bearer ${token}`}
        })
        const data = await response.json()

        if ( data.status !== "success") {
            setError(data.message)
            return
        }

        setOrder(data.data.order)
    }

        async function handleReject() {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3000/api/orders/${id}/reject`,{
            method : 'PATCH',
            headers : { Authorization : `Bearer ${token}`}
        })
        const data = await response.json()

        if ( data.status !== "success") {
            setError(data.message)
            return
        }

        setOrder(data.data.order)
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>{ error }</p>

    const canModerate = (user.role === 'admin' ||
                         user.role === 'general_manager') &&
                        order.status === 'pending_approval'
    

    return (
        <div>
            <h1>Order Detail</h1>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalAmount}</p>
            <p>Customer: {order.customerId.name}</p>
            <p>Created: {order.createdAt}</p>

            {canModerate && (
                <div>
                    <button onClick={handleApprove}>Approve</button>
                    <button onClick={handleReject}>Reject</button>
                </div>
            )}
        </div>
    )
}

export default OrderDetail