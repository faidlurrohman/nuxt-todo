import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tresholdDate = new Date();

export default defineEventHandler(async (event) => {
  const incomingTasks = await prisma.todolist.findMany({
    where: {
      date: {
        gt: new Date(tresholdDate),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return incomingTasks;
});
