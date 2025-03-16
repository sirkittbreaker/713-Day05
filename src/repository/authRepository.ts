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

export async function registerUser(
  organizerName: string,
  username: string,
  password: string,
  roleNames: string[]
) {
  const roles = await prisma.role.findMany({
    where: {
      name: {
        in: roleNames,
      },
    },
  });

  // Create the user with associated roles
  return prisma.user.create({
    data: {
      username: username,
      password: password,
      roles: {
        connect: roles.map((role) => ({ id: role.id })),
      },
      organizer: {
        create: {
          name: organizerName,
        },
      },
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

export async function updatePassword(userId: number, password: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: password,
    },
  });
}
