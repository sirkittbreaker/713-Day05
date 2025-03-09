import { organizer } from "./../../node_modules/.prisma/client/index.d";
import { PrismaClient } from "@prisma/client";
import type { Event, PageEvent } from "../models/event";
import { title } from "process";

const prisma = new PrismaClient();

export function getEventByCategory(category: string) {
  return prisma.event.findMany({
    where: { category },
  });
}

export function getAllEvents() {
  return prisma.event.findMany();
}

export function getEventById(id: number) {
  return prisma.event.findUnique({
    where: { id },
    omit: {
      organizerId: true,
    },
  });
}

export function getAllEventsWithOrganizer() {
  return prisma.event.findMany({
    select: {
      id: true,
      category: true,
      organizerId: false,
      organizer: {
        select: {
          name: true,
        },
      },
      participants: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export function getEventByIdWithOrganizer(id: number) {
  return prisma.event.findUnique({
    where: { id },
  });
}
export function addEvent(newEvent: Event) {
  return prisma.event.create({
    data: {
      category: newEvent.category || "",
      title: newEvent.title || "",
      description: newEvent.description || "",
      location: newEvent.location || "",
      date: newEvent.date || "",
      time: newEvent.time || "",
      petsAllowed: newEvent.petsAllowed || false,
    },
    omit: {
      organizerId: true,
    },
  });
}

export async function getAllEventsWithOrganizerPagination(
  keyword: string,
  pageSize: number,
  pageNo: number
) {
  const where: any = {
    OR: [
      { title: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
      { category: { contains: keyword, mode: "insensitive" } },
      { organizer: { name: { contains: keyword, mode: "insensitive" } } },
    ],
  };

  const events = await prisma.event.findMany({
    where: where,
    skip: pageSize * (pageNo - 1),
    take: pageSize,
    omit: {
      organizerId: true,
    },
    include: {
      organizer: {
        select: {
          name: true,
        },
      },
    },
    // select: {
    //   id: true,
    //   title: true,
    //   category: true,
    //   description: true,
    //   organizerId: false,
    //   organizer: {
    //     select: {
    //       name: true,
    //     },
    //   },
    // },
  });
  const count = await prisma.event.count({ where });
  return { count, events } as PageEvent;
}

export function countEvent() {
  return prisma.event.count();
}
