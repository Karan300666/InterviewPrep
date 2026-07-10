import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { userInterviews, getInterview } from "../controllers/interview.controller";

const router = Router();

router.get('/get' , authenticateUser , userInterviews)
router.get('/get/user', getInterview)

export default router