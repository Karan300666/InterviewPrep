import { z } from "zod";
import { Request, Response } from "express";
import { prisma } from '../lib/prisma'
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import getAIResponse from "../services/AI.service";


const createInterviewSchema = z.object({
    type: z.string(),
    role: z.string(),
    level: z.string(),
    techStack: z.string(),
    amount: z.string(),
    userId: z.string().uuid()
})
export async function creatingInterview(req: Request , res: Response){
    const result = createInterviewSchema.safeParse(req.body)

    if(!result.success){
        return res.status(400).json({
            message: "Invalid input",
            errors:  result.error.flatten()
        })
    }

    const { type, role, level, techStack, amount, userId} = req.body;
    const techStackArray = techStack
                           .split(",")
                           .map((tech: string) => tech.trim())
                           .filter((tech: string) => tech.length > 0)
    try {

        console.log("vapi body", req.body)
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

        if(!AIresponse){
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
                question: AIResponseArray,
            }
        })
        return res.status(200).json({
            message: "creating interview successfully",
        })

    } catch (err) {
        return res.status(500).json({
            message: "creating interview is failed"
        })
    }

}