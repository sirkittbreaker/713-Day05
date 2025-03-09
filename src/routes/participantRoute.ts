import express from "express";
import * as service from "../services/participantService";
import e from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = parseInt(req.query.pageSize as string) || 3;
  const pageNo = parseInt(req.query.pageNo as string) || 1;
  const keyword = (req.query.keyword as string) || "";
  try {
    const result = await service.getAllParticipantsWithPagination(
      keyword,
      pageSize,
      pageNo
    );
    if (result.participants.length === 0) {
      res.status(404).send("No participant found");
      return;
    }
    res.setHeader("x-total-count", result.count.toString());
    res.setHeader("Access-Control-Expose-Headers", "x-total-count");
    res.json(result.participants);
  } catch (error) {
    if (pageNo < 1 || pageSize < 1) {
      res.status(400).send("Invalid page number or page size");
    } else {
      res.status(500).send("Internal server error");
    }
    return;
  } finally {
    console.log(
      `Request is completed. with pageNo: ${pageNo} and pageSize: ${pageSize} and keyword: ${keyword}`
    );
  }
});

export default router;
