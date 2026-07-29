import { Worker } from "bullmq"
import redis from "../config/redis"
import { prisma } from '../lib/prisma'
import getAIResponse from "../services/AI.service";
import { getJSDocPublicTag } from "typescript";



const worker = new Worker(
    "interview-feedback",
    async(job) => {
     const {userId, interviewId, chat} = job.data;
      
          const formattedChat = chat
                .map((sentence: { role: string; message: string }) => (
                    `- ${sentence.role}: ${sentence.message}\n`
                )).join('')
            const AIresponse = await getAIResponse(
                ` You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
               Chat:
                   ${formattedChat}
 
        Please score the candidate from 0 to 10 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
           
            Return only valid JSON.
            Do not include markdown.
            Do not write \`\`\`json.
            Do not add any explanation.
            Use exactly this structure:
            Format: 
                   {
                      "totalScore": number,
                      "categoryScores": number,
                      "strengths": ["string"],
                      "areasForImprovement": ["string"],
                      "finalAssessment": "string,

                    }
                `)
              
                if(!AIresponse){
                  throw new Error("API failed")
                }
            const feedback = JSON.parse(AIresponse)

            const result = await prisma.feedback.create({
                data: {
                    userId,
                    interviewId,
                    totalScore: feedback.totalScore,
                    categoryScores: feedback.categoryScores,
                    strengths: feedback.strengths,
                    areasForImprovement: feedback.areasForImprovement,
                    finalAssessment: feedback.finalAssessment
                }
            })

            await prisma.interview.update({
                where: {
                    id: userId
                },
                data: {
                    status: "COMPLETED"
                }
            })
    },
    {
    connection: redis
    }
)

worker.on("failed", async(job, err) => {
      if(!job) return;
      const userId = job.data.userId
      await prisma.interview.update({
                where: {
                    id: userId
                },
                data: {
                    status: "CANCELLED"
                }
            })
})