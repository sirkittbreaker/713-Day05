import { PrismaClient } from "@prisma/client";
import type { Participant, PageParticipant } from "../models/participant";

const prisma = new PrismaClient();

export async function getParticipantById(id: number) {
  return prisma.participant.findUnique({
    where: { id },
    include: {
      events: {
        select: {
          id: true,
          category: true,
          title: true,
          description: true,
          location: true,
          date: true,
          time: true,
          petsAllowed: true,
        },
      },
    },
  });
}

export async function getAllParticipantsWithPagination(
  keyword: string,
  pageSize: number,
  pageNo: number
) {
  const where: any = {
    OR: [
      { name: { contains: keyword, mode: "insensitive" } },
      { email: { contains: keyword, mode: "insensitive" } },
    ],
  };
  const participants = await prisma.participant.findMany({
    where: where,
    skip: pageSize * (pageNo - 1),
    take: pageSize,
    include: {
      events: {
        select: {
          id: true,
          category: true,
          title: true,
          description: true,
          location: true,
          date: true,
          time: true,
          petsAllowed: true,
        },
      },
    },
  });
  const count = await prisma.participant.count();
  return { count, participants } as PageParticipant;
}
