import { z } from "zod";
import { Request, Response } from "express";
import { prisma } from '../lib/prisma'
import getAIResponse from "../services/AI.service";


const createInterviewSchema = z.object({
    type: z.string(),
    role: z.string(),
    level: z.string(),
    techStack: z.string(),
    amount: z.string(),
    userId: z.string().uuid()

})
export async function createInterview(req: Request, res: Response) {
    const message = req.body.message;


    if (message.type !== 'tool-calls') {
        return res.status(200).json({ received: true });
    }

    const toolCall = message.toolCalls[0];


    const result = createInterviewSchema.safeParse(toolCall.function.arguments)

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: result.error.flatten()
        })
    }
    const { role, type, level, amount, techStack, userId } = toolCall.function.arguments;
    const techStackArray = techStack
        .split(",")
        .map((tech: string) => tech.trim())
        .filter((tech: string) => tech.length > 0)
    try {


        const AIresponse = await getAIResponse(
            `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techStack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
    `
        )

        if (!AIresponse) {
            return res.status(500).json({
                message: "AI can't create questions"
            })
        }
        const AIResponseArray = AIresponse
            .split(",")
        const interview = await prisma.interview.create({
            data: {
                userId,
                role,
                level,
                type,
                amount,
                techStack: techStackArray,
                questions: AIResponseArray
            }
        })
        return res.status(200).json({
            message: "Created interview successfully",
        })

    } catch (err) {
        return res.status(500).json({
            message: "Creating interview is failed"
        })
    }

}

export async function createInterviewFeedback(req: Request, res: Response) {
    const message  = req.body.message;
   
    try {
        if (message.type === "end-of-call-report") {
            const userId = message.call.assistantOverrides.variableValues.userId
            const interviewId = message.call.assistantOverrides.variableValues.interviewId
            const chat = message.artifact.messages;
            console.log("userId", userId)
            console.log("chat", chat)
            console.log("interviewId", interviewId)
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
         
        
        `
            )

            if (!AIresponse) {
                return res.status(500).json({
                    message: "AI can't create questions"
                })
             }
             const feedback = JSON.parse(AIresponse)

             const result = await feedback.create({
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
             
             res.status(200).json({
                messages: "Feedback created successfully",
                result
             })
            
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error saving feedback"
        })
    }
}