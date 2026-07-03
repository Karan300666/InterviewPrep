import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from '../lib/prisma'

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

type JwtPayload = {
    id: string;
}
export async function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
   
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }
        if(!process.env.JWT_SECRET){
            throw new Error("JWT_SECRET in not defined")
        }
    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET
          ) as JwtPayload;
         const userId = decoded.id;
       

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        req.userId = user.id;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
         });
    }
}