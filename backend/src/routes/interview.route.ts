import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { userInterviews } from "../controllers/interview.controller";

const router = Router();

router.get('/get' , authenticateUser , userInterviews)

export default router