import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const tasks = await prisma.todolist.findMany({
    where: {
      date: new Date(),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return tasks;
});
