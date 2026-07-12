import React from 'react'
import api from '@/lib/axios';
import { redirect } from "next/navigation";

const page = async({ params }: RouteParams) => {
    const { id } = await params
    let res;
      try{
       res = await api.get('/api/interview/get/feedback' , {
        params: {
          interviewId: id
          
        }
       });
     
      } catch(err){
        redirect('/')
      }
      const feedback = res?.data?.feedback ?? [];

      const strengths = feedback.strengths
  return (
    <div className='sm:mx-60'>
        <h1 className='text-4xl font-extrabold text-center'>Feedback on the Interview</h1>
        <div className=''>
        <h3 className='mt-20  px-3'>Category score: {feedback.categoryScores}</h3>
        <h3 className='mt-5 px-3'>Totol score: {feedback.totalScore}</h3>
    </div>

    <div>
        <div className='flex gap-5 flex-col mt-8 '>
            <h1 className='text-4xl  font-bold mb-4'>Strengths</h1>
            {strengths.map((strength: any) =>(
                <li className='' key={strength}>{strength}</li>
            ))}
        </div>
        <div>
            <h1 className='text-4xl  font-bold mt-8 mb-4'>Areas for Improvement</h1>
           <p>{feedback.areasForImprovement}</p>
        </div>
        <div>
            <h1 className='text-4xl  font-bold mt-8 mb-4'>Final Assesment</h1>
           <p>{feedback.finalAssessment}</p>
        </div>
    </div>
      
    </div>
  )
}

export default page
