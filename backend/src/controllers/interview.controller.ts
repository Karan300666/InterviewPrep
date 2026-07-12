import { prisma } from '../lib/prisma'
import { AuthenticatedRequest } from '../middlewares/auth.middleware'
import { Response, Request } from 'express'

export async function userInterviews(req: AuthenticatedRequest, res: Response) {

    const interviews = await prisma.interview.findMany({
        where: {
            userId: req.userId
        }
    })

    if (!interviews || interviews.length === 0) {
        return res.status(200).json({
            message: "Not found any interview",
        })
    }
    res.status(200).json({
        message: "Interview found successfully",
        interviews
    })

}


export async function getInterview(req: Request, res: Response) {
    const interviewIdParam = req.query.interviewId;
    try {
        if (typeof interviewIdParam !== 'string') {
            return res.status(400).json({ message: "Invalid interview ID" });
        }
        const interview = await prisma.interview.findUnique({
            where: {
                id: interviewIdParam
            }
        })
        return res.status(200).json({
            message: "Interview found successfully",
            interview
        })
    } catch (error) {
        return res.status(400).json({
            message: "Interview not found"
        })
    }
}

export async function getFeedback(req: Request, res: Response){
    const interviewIdParam = req.query.interviewId;

    try {
        if(typeof interviewIdParam !== 'string'){
            return res.status(400).json({ message: "Invalid interview ID" });
        }

        const feedback = await prisma.feedback.findFirst({
            where: {
                 interviewId: interviewIdParam
            }
        }) 
        return res.status(200).json({
            message: "Feedback found successfully",
            feedback
        })
    } catch (error) {
        return res.status(200).json({
            message: "Feedback not found",
        })
    }
}