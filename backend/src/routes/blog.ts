import { createBlogInput, updateBlogInput } from "@_prasadk_/inspirewrite-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string,
        filter: string
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    const token = jwt.split(' ')[1];
    const user = await verify(token, c.env.JWT_SECRET);
    if (!user) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    //@ts-ignore
    c.set('userId', user.id);
    await next()
})


blogRouter.post('/', async (c) => {

    const body = await c.req.json();

    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "invalid input" });
    }

    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env?.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId,
            area : body.area
        }
    })

    return c.json({
        id: blog.id
    });
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();

    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "invalid input" });
    }

    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env?.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
            authorId,
            area : body.area
        }
    })

    return c.json({
        id: blog.id
    });
})

blogRouter.get('/bulk', async (c) => {

    const filter = c.req.query("filter")?.trim() || "";
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const blogsByUser = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            area: true,
            author: {
                select: {
                    name: true,
                    occupation: true
                }
            },
            publishedAt: true
        },
        where: {
            author: {
                name: {
                    contains: filter,
                    mode: 'insensitive'
                }
            }
        }
    });
    const blogsByContent = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            area: true,
            author: {
                select: {
                    name: true,
                    occupation: true
                }
            },
            publishedAt: true
        },
        where: {
            OR: [
                {
                    content: {
                        contains: filter,
                        mode: 'insensitive'
                    }
                },
                {
                    title: {
                        contains: filter,
                        mode: 'insensitive'
                    }
                }
            ]
        }
    });

    const blogsMap = new Map();
    blogsByUser.concat(blogsByContent).forEach(blog => {
        blogsMap.set(blog.id, blog);
    });
    const blogs = Array.from(blogsMap.values());
    return c.json({
        blogs
    })
})

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: String(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                area: true,
                author: {
                    select: {
                        name: true ,
                        occupation: true
                    }
                },
                publishedAt: true
            }
        })
    
        return c.json({
            blog
        });
    } catch(e) {
        c.status(411); 
        return c.json({
            message: "Error while fetching blog post"
        });
    }
})


