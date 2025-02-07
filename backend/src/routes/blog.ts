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
        userId: string
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
            authorId
        }
    })

    return c.json({
        id: blog.id
    });
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env?.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
        where : {
            id : body.id
        },
        data: {
            title: body.title,
            content: body.content,
            authorId
        }
    })

    return c.json({
        id: blog.id
    });
})

blogRouter.get('/bulk', async(c) => {
    const body = await c.req.json();
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env?.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany();

    return c.json({
        blogs
    });
})

blogRouter.get('/:id', async (c) => {
    const id = await c.req.param("id");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env?.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());

    const blog = await prisma.post.findFirst({
        where : {
            id
                }
    })

    return c.json({
        blog
    });
})
