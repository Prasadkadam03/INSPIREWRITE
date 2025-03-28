import z from "zod";

//signup input
export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
    occupation: z.string().min(3),
    bio : z.string().min(3),
})

export type SignupInput = z.infer<typeof signupInput>

//signin input
export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export type SigninInput = z.infer<typeof signinInput>

export const updateUserInput = z.object({
    email: z.string().email().optional(),
    name: z.string().min(3).optional(),
    occupation: z.string().optional(),
    bio : z.string().min(3).optional(),
})

export type updateUserInput = z.infer<typeof updateUserInput>

//create blog input
export const createBlogInput = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    area : z.string().min(3)
})

export type CreateBlogInput = z.infer<typeof createBlogInput>

//update blog input
export const updateBlogInput = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    area : z.string().min(3),
})

export type UpdateBlogInput = z.infer<typeof updateBlogInput>