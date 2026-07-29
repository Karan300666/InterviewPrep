import { Queue } from 'bullmq'
import redis from '../config/redis'

export const interviewQueue = new Queue("interview-feedback", {
    connection: redis
})