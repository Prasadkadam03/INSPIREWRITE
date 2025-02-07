import z from "zod";

//signup input
export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})

export type SignupInput = z.infer<typeof signupInput>

//signin input
export const signinInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
})

export type SigninInput = z.infer<typeof signinInput>

//create blog input
export const createBlogInput = z.object({
    title: z.string(),
    content: z.string(),
})

export type CreateBlogInput = z.infer<typeof createBlogInput>

//update blog input
export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.string()
})

export type UpdateBlogInput = z.infer<typeof updateBlogInput>