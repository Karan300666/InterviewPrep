import Agent from '@/components/Agent'
import React from 'react'
import api from "@/lib/axios";
import { redirect } from "next/navigation";


const page = async ({ params }: RouteParams) => {
    const { id } = await params
    
 let res;
      try{
       res = await api.get('/api/interview/get/user' , {
        params: {
          interviewId: id
          
        }
       });
     
      } catch(err){
        redirect('/sign-in')
      }
      const interview = res?.data?.interview ?? [];
  return (
    <>
    <h3 className='-mt-6'>Interview</h3>
      <Agent interviewId={id} questions={interview.questions} userId={interview.userId} type='interview' />
    </>
  )
}

export default page
