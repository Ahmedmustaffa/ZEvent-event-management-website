import { Router } from "express";

import {
    createNewTicket,
    getTicketById,
    getAllTickets,
    deleteTicket,
    updateTicketToUsed
} from "../controllers/ticket.controller.js";

import {
    protect
} from "../middlewares/authMW.js";

const router = Router();

router.get("/", protect, getAllTickets); //R
router.post("/", protect, createNewTicket); //C
router.get("/:id", protect, getTicketById); //R
router.delete("/:id", protect, deleteTicket); //D
router.put("/:id/use", protect, updateTicketToUsed); //U


export default router;