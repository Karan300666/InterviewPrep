import Redis from "ioredis"

const redis = new Redis(
     process.env.REDIS_URL!,
     {
     maxRetriesPerRequest: null,
     }
    )

redis.on("connect", () => {
    console.log("Redis connected")
})

redis.on("reconnecting", () => {
    console.log("Redis reconnected..")
})

redis.on("error", (err) => {
    console.log("Redis error: ", err)
})

export default redis