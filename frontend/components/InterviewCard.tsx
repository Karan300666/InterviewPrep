import React from 'react'
import dayjs from 'dayjs';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons'

const InterviewCard = ({
      id,
      userId,
      role,
      type,
      techStack,
      status,
      createdAt,
    }: InterviewCardProps) => {
     const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(createdAt ||  Date.now()).format("DD/MM/YYYY");
  return (
    <div className='card-border w-90 max-sm:w-full min-h-28 text-white'>
       <div className='card-interview'>
        <div>
            <div className='absolute w-fit  top-0 right-0  px-2 py-2  rounded-bl-lg bg-light-600'>
                <p className='badge-text'>{normalizedType}</p>
               
                </div>
           
        </div>
        <h3 className='-mt-10 capitalize' >
                   {role} Interview
                </h3>
         <p className='line-clamp-2 '>
                    {status == 'COMPLETED' || "You Haven't taken the interview yet. Take it now to improve skills"}

                </p>
                  <div className='flex flex-row gap-5 '>
                    <div className='flex flex-row gap-2'>
                        <Image src="/images/calendar[1].svg" alt='calender' width={22} height={22}/>
                        <p className=''>{formattedDate}</p>
                    </div>
                    
                   
                </div>
                 <div className='flex flex-row justify-between'>
                   <DisplayTechIcons techStack={techStack} />
                   <Link href={status == 'COMPLETED' ? `/interview/${id}/feedback` : `/interview/${id}`}>
                     <Button className='btn-primary'>
                       {status == 'COMPLETED' ? 'Check Feedback' : 'View Interview'}
                     </Button>
                   </Link> 
                </div>
           
         
               
       </div>

    
       </div>
        
            
   
  )
}

export default InterviewCard
