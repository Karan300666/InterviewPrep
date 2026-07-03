import { Router} from "express";
import { getCurrentUser, signinUser, signupUser } from "../controllers/auth.controller";
import { authenticateUser } from '../middlewares/auth.middleware'


const router = Router()

router.post('/sign-up' , signupUser )
router.post('/sign-in' , signinUser)
router.get('/getUser' , authenticateUser,  getCurrentUser)

export default router