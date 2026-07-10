import { z } from "zod";
import { Request, Response, CookieOptions } from "express";
import { prisma } from '../lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const signupSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8)
})
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000
const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: ONE_WEEK
}

export async function signupUser(req: Request, res: Response) {
    try {
        const result = signupSchema.safeParse(req.body)
        const { name, email, password } = req.body

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid input",
                error: result.error.flatten()
            })
        }

        const isUserAlredyExist = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        })
        if (isUserAlredyExist) {
            return res.status(400).json({
                message: "User already exist"
            })
        }
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email.toLowerCase(),
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET in not defined")
        }
        const token = jwt.sign(
            {
                id: user.id,
            }, process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "Account created successfully",
            user
        })

    } catch (err) {
        return res.status(500).json({
            message: `Internal server error ${err}`
        })
    }
}

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export async function signinUser(req: Request, res: Response) {
    try {
        const result = signinSchema.safeParse(req.body)
        const { email, password } = req.body
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid input",
                error: result.error.flatten
            })
        }

        const isUserExist = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        })
        if (!isUserExist) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, isUserExist.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET in not defined")
        }
        const token = jwt.sign(
            {
                id: isUserExist.id,
            }, process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "User sign in successfully",
            isUserExist

        })
    } catch (err) {
        return res.status(500).json({
            message: `Internal server error ${err}`
        })
    }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response) {

    try {


        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        res.status(200).json({
            message: "User find successfully",
            user
        })
    } catch (error) {
        return res.status(400).json({
            message: "User not found"

        })
    }
}

