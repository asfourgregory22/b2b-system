import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateUser() {
    const navigate = useNavigate()

    const [ name , setName ] = useState('')
    const [ email , setEmail ] = useState('')
    const [ password , setPassword ] = useState('')
    const [ passwordConfirm , set ] = useState('')
    const [  , set ] = useState('')
    const [  , set ] = useState('')

}

export default CreateUser