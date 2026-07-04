import { Router} from "express";
import { creatingInterview } from "../controllers/AI.controller";
import { authenticateUser } from "../middlewares/auth.middleware";



const router = Router()

router.post('/create/interview', creatingInterview )

export default router