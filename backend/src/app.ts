import express from 'express'
import authRouter  from './routes/auth.route'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AIRouter from './routes/AI.route'
import interviewRouter from './routes/interview.route'
const app = express();
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET" , "POST" , "PUT" , "DELETE"],
    credentials: true,
}

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
})
app.set("trust proxy", 1);
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/AI', AIRouter)
app.use('/api/interview' , interviewRouter)

export default app;
