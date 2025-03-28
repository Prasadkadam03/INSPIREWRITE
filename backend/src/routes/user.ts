import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signinInput, signupInput, updateUserInput } from "@_prasadk_/inspirewrite-common";
import bcrypt from "bcryptjs";



export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string
	}
}>();

userRouter.post('/signup', async (c) => {
	const body = await c.req.json();
	const { success } = signupInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "Invalid input" });
	}
	const prisma = new PrismaClient({
		datasources: {
			db: {
				url: c.env?.DATABASE_URL,
			},
		},
	}).$extends(withAccelerate());

	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (user) {
		c.status(403);
		return c.json({ error: "User already exist" });
	}

	const hashedPassword = await bcrypt.hash(body.password, 10);

	try {
		const user = await prisma.user.create({
			data: {
				name: body.name,
				email: body.email,
				password: hashedPassword,
				occupation: body.occupation,
				bio: body.bio,
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch (e) {
		c.status(403);
		return c.json({ error: "Error while signing up" });
	}
});

userRouter.post('/signin', async (c) => {
	const body = await c.req.json();

	const { success } = signinInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "Invalid input" });
	}

	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "User not found" });
	}
	const isPasswordValid = await bcrypt.compare(body.password, user.password);
	if (!isPasswordValid) {
		c.status(403);
		return c.json({ error: "Invalid password" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})

userRouter.get('/', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: "Unauthorized" });
    }
	const token = jwt.split(' ')[1];
	const user = await verify(token, c.env.JWT_SECRET) as { id: string };
	if (!user) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const me = await prisma.user.findUnique({
		where: {
			id: user.id
		}
	});
	return c.json({ id: me?.id, name: me?.name , occupation: me?.occupation , bio: me?.bio });
})

userRouter.put('/updateUser', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: "Unauthorized" });
    }

    const token = jwt.split(' ')[1];
    const user = await verify(token, c.env.JWT_SECRET) as { id: string };
    if (!user) {
        c.status(401);
        return c.json({ error: "Unauthorized" });
    }

    const body = await c.req.json();

    const { success, data } = updateUserInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "Invalid input" });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                name: data.name,
                occupation: data.occupation,
                bio: data.bio,
            },
        });

        return c.json({
            id: updatedUser.id,
            name: updatedUser.name,
            occupation: updatedUser.occupation,
            bio: updatedUser.bio,
        });
    } catch (e) {
        c.status(500);
        return c.json({ error: "Error updating user" });
    }
});