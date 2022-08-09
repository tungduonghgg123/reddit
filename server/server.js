import fastify from "fastify";
import sensible from "@fastify/sensible";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
// load all env vars
dotenv.config();

const app = fastify();
app.register(sensible);
const prisma = new PrismaClient();

app.get("/posts", async (req, res) => {
  return commitToDb(
    prisma.post.findMany({
      select: {
        title: true,
        id: true,
      },
    })
  );
});

async function commitToDb(promise) {
  const [error, data] = await app.to(promise);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}
app.listen({ port: process.env.PORT });
