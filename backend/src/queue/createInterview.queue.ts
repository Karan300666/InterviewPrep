import { Queue } from 'bullmq'
import redis from '../config/redis'

export const interviewQueue = new Queue("create-interview", {
    connection: redis
})