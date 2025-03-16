import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export function findByUsername(username: string) {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      roles: true,
      organizer: true,
    },
  });
}

export function findByUserId(userId: number) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      roles: true,
      organizer: {
        include: {
          events: true,
        },
      },
    },
  });
}
