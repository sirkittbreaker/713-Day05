import type { Event } from "../models/event";
import * as repo from "../repository/eventRepositoryPrisma";

export function getEventByCategory(category: string) {
  return repo.getEventByCategory(category);
}

export function getAllEvents() {
  return repo.getAllEventsWithOrganizer();
}

export function getEventById(id: number) {
  return repo.getEventById(id);
}

export function addEvent(newEvent: Event) {
  return repo.addEvent(newEvent);
}

export async function getAllEventsWithPagination(
  keyword: string,
  pageSize: number,
  pageNo: number
) {
  const pageEvents = await repo.getAllEventsWithOrganizerPagination(
    keyword,
    pageSize,
    pageNo
  );
  return pageEvents;
}

export function count() {
  return repo.countEvent();
}
