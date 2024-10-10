import { PrismaClient } from "@prisma/client";

interface ITask {
  title: string;
  date: Date;
}

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody<ITask>(event);

  const task = await prisma.todolist.create({
    data: {
      title: body.title,
      date: body.date,
    },
  });
  return task;
});
