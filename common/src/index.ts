import z from "zod";


const stripHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();


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
  content: z.string().min(1).refine(
    (val) => stripHtml(val).length >= 10,
    { message: "Content must be at least 10 characters (excluding HTML)." }
  ),
  area: z.string().min(3),
});

export const updateBlogInput = createBlogInput.extend({
  id: z.string().min(1),
});



export type UpdateBlogInput = z.infer<typeof updateBlogInput>