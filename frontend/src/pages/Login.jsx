import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [ email , setEmail ] = useState('')
    const [ password , setPassword ] = useState('')
    const [ error , setError ] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify({ email , password })
            }) 

            const data = await response.json()

            if (data.status !== 'success') {
                setError(data.message)
                return
            }

            localStorage.setItem('token',data.token)
            navigate('/dashboard')
        }catch(err){
            console.error(err)
            setError('Something went wrong. Please try again.')
        }
    }
    return(
        <div>
            <h1>Login</h1>
            <form onSubmit = { handleSubmit }>
                
                <input
                type = "email"
                placeholder = "Email"
                value = { email }
                onChange = {(e) => setEmail(e.target.value)}
                />
               
                <input
                type = "password"
                placeholder = "Password"
                value = { password }
                onChange = {(e) => setPassword(e.target.value)}
                />

                <button type = "submit">Log In</button>
            
            </form>
            { error && <p>{error}</p>}
        </div>
    )
}

export default Login