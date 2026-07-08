import React from 'react'
import { setUser } from './UserSlice';
import { jwtDecode } from 'jwt-decode';


function setUserInfoOnReload(dispatch) {
  
  try {
    const token = JSON.parse(localStorage.getItem("token"));
   
    if (!token) {
      return

    }
    let { email, id } = jwtDecode(token)
  
    // useDispatch(setUser({ email, id, token }))
    dispatch(setUser({email,id,token}))
  } catch (error) {
    

  }

}

export  {setUserInfoOnReload}