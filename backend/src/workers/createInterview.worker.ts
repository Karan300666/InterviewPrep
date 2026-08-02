import { Worker } from "bullmq"
import redis from "../config/redis"
import { prisma } from '../lib/prisma'
import getAIResponse from "../services/AI.service";


const worker = new Worker(
    "interview-feedback",
    async (job) => {
        const { role, type, level, amount, techStack, userId } = job.data;
        const techStackArray = techStack
            .split(",")
            .map((tech: string) => tech.trim())
            .filter((tech: string) => tech.length > 0)

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
            throw new Error("AI failed to create interview")
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
            await redis.del(cacheKey)
        }
    },
    {
        connection: redis
    }
)

worker.on("failed", async (job, err) => {
    if (!job) return;
    throw new Error("Create interview is failed")
})