import { Router} from "express";
import { createInterview, createInterviewFeedback } from "../controllers/AI.controller";
import { authenticateUser } from "../middlewares/auth.middleware";



const router = Router()

router.post('/create/interview', createInterview )
router.post('/create/interview/feedback', createInterviewFeedback )

export default router