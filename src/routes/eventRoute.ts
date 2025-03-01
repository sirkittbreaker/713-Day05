import express, { Request, Response } from "express";
import * as service from "../services/eventService";
import type { Event } from "../models/event";
import exp from "constants";
const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = parseInt(req.query.pageSize as string) || 3;
  const pageNo = parseInt(req.query.pageNo as string) || 1;
  const keyword = req.query.keyword as string;
  try {
    const result = await service.getAllEventsWithPagination(
      keyword,
      pageSize,
      pageNo
    );
    if (result.events.length === 0) {
      res.status(404).send("No event found");
      return;
    }
    res.setHeader("X-Total-Count", result.count.toString());
    res.json(result.events);
  } catch (error) {
    if (pageNo < 1 || pageSize < 1) {
      res.status(400).send("Invalid page number or page size");
    } else {
      res.status(500).send("Internal server error");
    }
    return;
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const event = await service.getEventById(id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).send("Event not found");
  }
});

router.post("/", async (req, res) => {
  const newEvent: Event = req.body;
  const result = await service.addEvent(newEvent);
  res.json(result);
});

export default router;
