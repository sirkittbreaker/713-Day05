import { event } from "./../../node_modules/.prisma/client/index.d";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function createEvents() {
  const events = [
    {
      category: "Music",
      title: "Concert",
      description: "A live concert",
      location: "London",
      date: "2021-07-01",
      time: "19:00",
      petsAllowed: false,
    },
    {
      category: "Music",
      title: "Festival",
      description: "A music festival",
      location: "Manchester",
      date: "2021-07-15",
      time: "12:00",
      petsAllowed: true,
    },
    {
      category: "Sports",
      title: "Football Match",
      description: "A football match",
      location: "Liverpool",
      date: "2021-08-01",
      time: "15:00",
      petsAllowed: false,
    },
    {
      category: "Music",
      title: "Jazz Night",
      description: "An evening of smooth jazz",
      location: "New Orleans",
      date: "2021-09-10",
      time: "19:00",
      petsAllowed: true,
    },
    {
      category: "Theatre",
      title: "Shakespeare in the Park",
      description: "A performance of Hamlet",
      location: "Central Park",
      date: "2021-10-05",
      time: "18:00",
      petsAllowed: false,
    },
    {
      category: "Food",
      title: "Food Truck Festival",
      description: "A variety of food trucks offering delicious meals",
      location: "San Francisco",
      date: "2021-11-20",
      time: "12:00",
      petsAllowed: true,
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: {
        category: event.category || "",
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        date: event.date || "",
        time: event.time || "",
        petsAllowed: event.petsAllowed || false,
      },
    });
  }

  const chiangMaiOrg = await prisma.organizer.create({
    data: {
      name: "Chiang Mai",
    },
  });

  const cmuOrg = await prisma.organizer.create({
    data: {
      name: "Chiang Mai Uniersity",
    },
  });

  const camtOrg = await prisma.organizer.create({
    data: {
      name: "CAMT",
    },
  });

  const responseEvents = await prisma.event.findMany();

  await prisma.event.update({
    where: { id: responseEvents[0].id },
    data: {
      organizer: {
        connect: {
          id: chiangMaiOrg.id,
        },
      },
    },
  });
  addOrganizer(responseEvents[1].id, chiangMaiOrg.id);
  addOrganizer(responseEvents[2].id, cmuOrg.id);
  addOrganizer(responseEvents[3].id, chiangMaiOrg.id);
  addOrganizer(responseEvents[4].id, camtOrg.id);
  addOrganizer(responseEvents[5].id, camtOrg.id);

  const roleAdmin = await prisma.role.create({
    data: {
      name: "ROLE_ADMIN",
    },
  });
  const roleUser = await prisma.role.create({
    data: {
      name: "ROLE_USER",
    },
  });
  const numSaltAround = 10;
  const user1 = await prisma.user.create({
    data: {
      username: "user1@abc.com",
      password: bcrypt.hashSync("password1", numSaltAround),
      organizer: {
        connect: {
          id: chiangMaiOrg.id,
        },
      },
      roles: {
        connect: [{ id: roleAdmin.id }, { id: roleUser.id }],
      },
    },
  });
  const user2 = await prisma.user.create({
    data: {
      username: "user2@abc.com",
      password: bcrypt.hashSync("password2", numSaltAround),
      organizer: {
        connect: {
          id: cmuOrg.id,
        },
      },
      roles: {
        connect: [{ id: roleUser.id }],
      },
    },
  });

  console.log("Database has been initialized with events.");
}

async function addOrganizer(eventId: number, organizerId: number) {
  await prisma.event.update({
    where: { id: eventId },
    data: {
      organizer: {
        connect: {
          id: organizerId,
        },
      },
    },
  });
}
