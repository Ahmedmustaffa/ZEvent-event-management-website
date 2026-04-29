import { Router } from "express";

import {
    createNewEvent,
    getEventById,
    getAllEvents,
    deleteEvent,
    updateEvent

} from "../controllers/event.controller.js";

import {
    protect
} from "../middlewares/authMW.js";

import { createEventValidator } from "../middlewares/eventValidator.js";
import validateResults from "../middlewares/validateResults.js";

const router = Router();

router.get("/", getAllEvents); //R
router.post("/", protect, createEventValidator, validateResults, createNewEvent); //C
router.get("/:id", protect, getEventById); //R
router.delete("/:id", protect, deleteEvent); //D
router.put("/:id", protect, updateEvent); //U



export default router;