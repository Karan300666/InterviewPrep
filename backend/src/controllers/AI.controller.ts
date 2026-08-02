import { z } from "zod";
import { Request, Response } from "express";
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

    try {
        const userId = req.body.userId
        await interviewQueue.add("generate-feedback", {
            role,
            type,
            level,
            amount,
            techStack,
            userId

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