import { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'



function NewOrder() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [ items , setItems ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ error , setError ] = useState('')
    const [ cart , setCart ] = useState([])
    const [ quantities , setQuantities ] = useState({})    
    const [ customerId , setCustomerId ] = useState('')

    useEffect (() => {
        async function fetchItems() {
            try{
                const token = localStorage.getItem('token')
                const response = await fetch ('http://localhost:3000/api/items', {
                    headers : { Authorization : `Bearer ${token}`}
                })

                const data = await response.json()

                if (data.status !== 'success') {
                    setError(data.message)
                    return
                }

                setItems(data.data.items)

            }catch(err){
                console.error(err)
                setError('Failed to load')
            } finally { setLoading(false) }
        }
        fetchItems()
    }, [])


    function handleAddToCart(item){
        const quantity = quantities[item._id]
        const existingEntry = cart.find((entry) => entry.itemId === item._id)
        
        if (existingEntry) {
            setCart(cart.map((entry) => 
                entry.itemId === item._id
                ? { ...entry , quantity : quantity }
                : entry
            ))
        } else {
            const newEntry = { itemId : item._id,
                               name : item.name,
                               quantity : quantity
                             }
            setCart([...cart , newEntry])
        }
    }

    async function handleSubmit() {
        try {
            const token = localStorage.getItem(`token`)

            const orderItems = cart.map((entry) => ({
                itemId : entry.itemId,
                quantity : entry.quantity
            }))

            const body = user.role === 'customer'
                ? { items : orderItems}
                : { customerId : customerId , items : orderItems }

            const url = user.role === 'customer'
                ? 'http://localhost:3000/api/orders/mine'
                : 'http://localhost:3000/api/orders'

            const response = await fetch ( url , {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${ token }`
                },
                body : JSON.stringify(body)
            })

            const data = await response.json()

            if (data.status !== 'success'){
                setError(data.message)
                return
            }

            navigate('/orders')

        }catch(err){
            console.error(err)
            setError('Failed to submit order')
        }
    }


    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            <h1>Items</h1>
            <ul>
                {items.map((item) =>( 
                    <li key={item._id}>
                        {item.name}—{item.sku} — ${item.price} — Qty: {item.quantity}
                        <input type = "number"
                               min = "1"
                               value = { quantities[item._id] || '' }
                               onChange = {(e) => setQuantities({...quantities , [item._id] : Number(e.target.value) })}
                               />
                        <button onClick = {() => handleAddToCart(item) }>Add to Order</button>
                    </li>
                ))}
            </ul>
            <h2>Cart</h2>
            <ul>
                {cart.map((entry) => (
                    <li key={entry.itemId}>
                        {entry.name} -- Qty : {entry.quantity}
                    </li>
                ))}
            </ul>

            {user.role !== 'customer' && (
                <div>
                    <label>Customer Id :</label>
                    <input
                        type = "text"
                        value = { customerId }
                        onChange={(e) => setCustomerId(e.target.value)}
                    />    
                </div>
            )}

            <button onClick = {handleSubmit}>Submit Order</button>
        </div>
    )
}

export default NewOrder