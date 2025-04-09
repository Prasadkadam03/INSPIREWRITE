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
    await next();
});

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
            area: body.area
        }
    });
    return c.json({
        id: blog.id
    });
});

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
            area: body.area
        }
    });
    return c.json({
        id: blog.id
    });
});

blogRouter.get('/bulk', async (c) => {
    const filter = c.req.query("filter")?.trim() || "";
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogsByUser = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            area: true,
            author: {
                select: {
                    name: true,
                    occupation: true,
                },
            },
            publishedAt: true,
            _count: {
                select: {
                    likes: true,
                },
            },
        },
        where: {
            author: {
                name: {
                    contains: filter,
                    mode: 'insensitive',
                },
            },
        },
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
                    occupation: true,
                },
            },
            publishedAt: true,
            _count: {
                select: {
                    likes: true,
                },
            },
        },
        where: {
            OR: [
                {
                    content: {
                        contains: filter,
                        mode: 'insensitive',
                    },
                },
                {
                    title: {
                        contains: filter,
                        mode: 'insensitive',
                    },
                },
            ],
        },
    });
    const blogsMap = new Map();
    blogsByUser.concat(blogsByContent).forEach((blog) => {
        blogsMap.set(blog.id, blog);
    });
    const blogs = Array.from(blogsMap.values()).sort((a, b) => b._count.likes - a._count.likes);
    return c.json({
        blogs,
    });

});

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: String(id),
            },
            select: {
                id: true,
                title: true,
                content: true,
                area: true,
                author: {
                    select: {
                        name: true,
                        occupation: true,
                        bio: true,
                    },
                },
                publishedAt: true,
                _count: {
                    select: {
                        likes: true,
                    },
                },
            },
        });
        if (!blog) {
            c.status(404);
            return c.json({ error: "Blog not found" });
        }

        return c.json({
            blog,
        });
    } catch (e) {
        console.error("Error fetching blog post:", e);
        c.status(500);
        return c.json({
            message: "Error while fetching blog post",
        });
    }
});

blogRouter.post('/:id/like', async (c) => {
    const postId = c.req.param("id");
    const userId = c.get("userId");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
        if (existingLike) {
            c.status(400);
            return c.json({ error: "You have already liked this post." });
        }
        await prisma.like.create({
            data: {
                userId,
                postId,
            },
        });
        return c.json({ message: "Post liked successfully." });
    } catch (error) {
        console.error("Error liking post:", error);
        c.status(500);
        return c.json({ error: "Error liking post." });
    }
});

blogRouter.delete('/:id/like', async (c) => {
    const postId = c.req.param("id");
    const userId = c.get("userId");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
        if (!existingLike) {
            c.status(400);
            return c.json({ error: "You have not liked this post." });
        }
        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
        return c.json({ message: "Post unliked successfully." });
    } catch (error) {
        console.error("Error unliking post:", error);
        c.status(500);
        return c.json({ error: "Error unliking post." });
    }
});

blogRouter.get('/:id/likes', async (c) => {
    const postId = c.req.param("id");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
    try {
        const likeCount = await prisma.like.count({
            where: {
                postId,
            },
        });
        return c.json({ likes: likeCount });
    } catch (error) {
        console.error("Error fetching like count:", error);
        c.status(500);
        return c.json({ error: "Error fetching like count." });
    }
});

blogRouter.get('/:id/liked', async (c) => {
    const postId = c.req.param("id");
    const userId = c.get("userId");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
        return c.json({ liked: !!existingLike });
    } catch (error) {
        console.error("Error checking like status:", error);
        c.status(500);
        return c.json({ error: "Error checking like status." });
    }
});

