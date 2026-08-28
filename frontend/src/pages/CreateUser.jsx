import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateUser() {
    const navigate = useNavigate()

    const [ name , setName ] = useState('')
    const [ email , setEmail ] = useState('')
    const [ password , setPassword ] = useState('')
    const [ passwordConfirm , setPasswordConfirm ] = useState('')
    const [ role , setRole ] = useState('salesman')
    const [ error , setError ] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        
        try{
            const token = localStorage.getItem('token')

            const body = role === 'customer'
                ? { name, email, password, passwordConfirm }
                : { name, email, password, passwordConfirm, role }
            
            const url = role === 'customer'
                ? 'http://localhost:3000/api/users/customers'
                : 'http://localhost:3000/api/users/register'

            const response = await fetch(url , {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify(body)
            })

            const data  = await response.json()

            if (data.status !== 'success') {
                setError(data.message)
                return
            }
            navigate('/users')

        }catch(err){
            console.error(err)
            setError('Failed to create new user')
        }
    }
    return (
        <div>
            <h1>Create User</h1>
            <form onSubmit = {handleSubmit}>
                
                <input
                    type = "text"
                    placeholder = "name"
                    value = {name}
                    onChange={(e) => setName(e.target.value)}
                    />

                 <input
                    type = "email"
                    placeholder = "Email"
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                <input
                    type = "password"
                    placeholder = "Password"
                    value = {password}
                    onChange={(e) => setPassword(e.target.value)}
                    />

                <input
                    type = "password"
                    placeholder = "Confirm Password"
                    value = {passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    />

                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="stock_manager">Stock Manager</option>
                    <option value="accountant">Accountant</option>
                    <option value="general_manager">General Manager</option>
                    <option value="salesman">Salesman</option>
                    <option value="customer">Customer</option>
                </select>

                <button type = "submit">Create User</button> 
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default CreateUser