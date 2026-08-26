import { useState , useEffect } from 'react'
import { useParams } from 'react-router-dom'


function OrderDetail() {
    const { id } = useParams()
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

    if (loading) return <p>Loading...</p>
    if (error) return <p>{ error }</p>

    return (
        <div>
            <h1>Order Detail</h1>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalAmount}</p>
            <p>Customer: {order.customerId.name}</p>
            <p>Created: {order.createdAt}</p>
        </div>
    )
}

export default OrderDetail