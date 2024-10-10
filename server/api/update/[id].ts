import { PrismaClient } from "@prisma/client";

interface ITask {
  isCompleted: boolean;
}

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  const body = await readBody<ITask>(event);

  const task = await prisma.todolist.update({
    where: {
      id,
    },
    data: {
      isCompleted: body.isCompleted,
    },
  });
  return task;
});
