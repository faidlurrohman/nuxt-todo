import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  const task = await prisma.todolist.delete({
    where: { id },
  });
  return task;
});
