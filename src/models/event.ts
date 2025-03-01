import type { Organizer } from "./organizer";
import type { Participant } from "./participant";

export interface Event {
  id: number;
  category: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  petsAllowed: boolean;
  organizerId: number | null;
  organizer: Organizer | null;
  participants: Participant[];
}

export interface PageEvent {
  count: number;
  events: Event[];
}
