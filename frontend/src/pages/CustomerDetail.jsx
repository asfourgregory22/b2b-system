import { useState , useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function CustomerDetail() {
    const { id } = useParams()
    const { user : loggedInUser } = useAuth()

    const [ customer , setCustomer ] = useState(null)
    const [ transactions , setTransactions ] = useState([])
    const [ balance , setBalance ] = useState(0)
    
    const [ loading , setLoading ] = useState(true)
    const [ error , setError ] = useState('')

    const [ amount , setAmount ] = useState('')
    const [ description , setDescription ] = useState('')

    useEffect(() => {
        async function fetchCustomer() {
            try{
                const token = localStorage.getItem('token')
                const response = await fetch( `http://localhost:3000/api/users/${id}` , {
                    headers : { Authorization : `Bearer ${token}`}
                })

                const data = await response.json()

                if (data.status !== "success") {
                    setError(data.message)
                    return
                }

                setCustomer(data.data.user)

            }catch(err){
                console.error(err)
                setError("Failed to load customer")
            }
        }
        fetchCustomer()
    }, [id])

    useEffect (() => {
        async function fetchTransactions() {
            try{
                const token = localStorage.getItem('token')
                const response = await fetch(`http://localhost:3000/api/transactions/${id}` , {
                    headers : { Authorization : `Bearer ${token}`}
                })

                const data = await response.json()

                if (data.status !== 'success') {
                    setError(data.message)
                    return
                }

                setTransactions(data.data.transactions)
                setBalance(data.balance)

            }catch(err){
                console.error(err)
                setError("Failed to load transactions")
            } finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [id])

    async function handleRecordPayment(e) {
        e.preventDefault()

        try{
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/api/transactions' , {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify({
                    customerId : id,
                    amount : Number(amount),
                    description
                })
            })

            const data = await response.json()

            if (data.status !== 'success') {
                setError(data.message)
                return
            }

            setTransactions([...transactions , data.data.transaction])
            setBalance(balance - Number(amount))
            setAmount('')
            setDescription('')

        }catch(err){
            console.error(err)
            setError('Failed to record action')
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p> 
    
    const canRecordPayment = loggedInUser.role === 'admin' || loggedInUser.role === 'accountant'

    return (
        <div>
            <h1>Customer Detail</h1>
            <p>Name : {customer.name}</p>
            <p>Email : {customer.email}</p>
            <p>Status : {customer.isActive ? 'Active' : 'Inactive'}</p>

            <h2>Balance : ${balance}</h2>
            <ul>
                {transactions.map((t) => (
                    <li key = {t._id}>
                        {t.type} — ${t.amount} — {t.description || 'No description'} — {t.createdAt}
                    </li>
                ))}
            </ul>

            {canRecordPayment && (
                <form onSubmit={handleRecordPayment}>
                    <h3>Record Payment</h3>
                    <input
                        type = "number"
                        placeholder = "Amount"
                        value = {amount}
                        onChange={(e) => setAmount(e.target.value)}
                        />
                    <input
                        type = "text"
                        placeholder = "Description"
                        value = {description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                    <button type = "submit">Record Payment</button>    
                </form>
            )}
        </div>
    )

}

export default CustomerDetail