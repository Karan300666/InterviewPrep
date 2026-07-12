import Agent from '@/components/Agent'
import React from 'react'
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import api from "@/lib/axios";
const page = async() => {
  const cookieStore = await cookies()
   const token = cookieStore.get("token")
    let res;
        try{
        res = await api.get('/api/auth/get/user' , {
          headers: {
            Cookie: `token=${token?.value}`
          }
         });
        } catch(err){
          redirect('/sign-in')
        }
        const user = res.data.user

       
  return (
   
    <>
    
    <h3 className='-mt-6'>Interview Generation</h3>

    <Agent userName={user?.name} userId={user?.id} type='generate'/>
    
    </>
  )
}

export default page
