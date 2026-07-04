import { prisma } from '../lib/prisma'
import { AuthenticatedRequest } from '../middlewares/auth.middleware'
import { Response } from 'express'

export async function userInterviews(req: AuthenticatedRequest , res: Response){

    const interviews = await prisma.interview.findMany({
        where:{
            userId: req.userId
        }
    })
    if(!interviews){
        res.status(404).json({
           message: "No interviews found"
        })
    }

    res.status(200).json({
        message: "Interview found successfully",
        interviews
    })

}