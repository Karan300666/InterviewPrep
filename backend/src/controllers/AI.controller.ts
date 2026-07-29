import { z } from "zod";
import { Request, Response } from "express";
import { prisma } from '../lib/prisma'
import getAIResponse from "../services/AI.service";
import redis from "../config/redis";
import { interviewQueue } from "../queue/interview.queue";

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

        const cacheKey = `interview:${userId}`
        const cacheData = await redis.get(cacheKey)
        if (cacheData) {
           await redis.del(cacheData)
        }

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
    const message = req.body.message;

    try {
        if (message.type === "end-of-call-report") {
            const userId = message.call.assistantOverrides.variableValues.userId
            const interviewId = message.call.assistantOverrides.variableValues.interviewId
            const chat = message.artifact.messages;
            
            await interviewQueue.add("generate-feedback", {
                userId,
                interviewId,
                chat
            },
            {
              attempts: 3, 
              backoff: {
                 type: "exponential",
                 delay: 5000
              }
            }
           )
               return res.status(200).json({
                messages: "request coming successfully",
            })

        }
    } catch (error) {
        return res.status(400).json({
            message: "Error saving feedback"
        })
    }
}