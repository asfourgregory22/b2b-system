import { useState , useEffect } from 'react'

function Items() {
    const [ items , setItems ] = useState([])
    const [ loading , setLoading ] = useState(true)
    const [ error , setError ] = useState('')

    useEffect(() => {
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
                setError('Failed to load items')
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            <h1>Items</h1>
            <ul>
                {items.map((item) =>( 
                    <li key={item._id}>
                        {item.name}—{item.sku} — ${item.price} — Qty: {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Items