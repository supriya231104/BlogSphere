import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

function VerifyUser() {
    const {verificationToken}=useParams()
    const navigate=useNavigate()
    async function verifyUser() {
        try {
            let res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify/${verificationToken}`)
            toast.success(`${res?.data?.message}`)
            navigate("/signin")
        } catch (error) {
            toast.error(`${error?.response?.data?.message}`)
           
            
        }
        
    }
    useEffect(()=>{
        verifyUser()

    },[verificationToken])
  return (
    <div>VerifyUser</div>
  )
}

export default VerifyUser