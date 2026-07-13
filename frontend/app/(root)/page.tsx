import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import api from "@/lib/axios";
import { redirect } from "next/navigation";

const page = async() => {
  
 const cookieStore = await cookies()

 let res;
      try{
       res = await api.get('/api/interview/get');
     
      } catch(err){
        redirect('/sign-in')
      }
      
      const interviews = res?.data?.interviews ?? [];
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2> Get Interview-Ready with AI-Powered Practice & Feebback</h2>

          <p className="text-lg">Practice on real interview questions & get instant feedback</p>
          <Button asChild className="btn-primary max-sm:w-full ">
            <Link href='/interview'>Start an Interview</Link>
          </Button>
        </div>
        <Image src='/images/robot.png' alt='robot' width={150} height={100} className="max-sm:hidden"/>
        
      </section>
      <section className=" mt-8">
        <h2>Your Interviews</h2>
        <div className="interview-section mt-10 flex flex-wrap gap-6">

          {interviews.length > 0 ? (
            interviews.map((interview: any) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You haven't taken any interview yet</p>
          )}

        </div>
       </section>
       
    </>
  );
};

export default page;
