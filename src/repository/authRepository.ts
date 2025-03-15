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
