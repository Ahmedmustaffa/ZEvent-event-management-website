import { body } from "express-validator";

export const createEventValidator = [
    body("mainTitle")
        .trim().notEmpty().withMessage("Event title is required")
        .isLength({ min: 5 }).withMessage("Title must be at least 5 characters"),
    body("capacity")
        .isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
    body("category")
        .notEmpty().isMongoId().withMessage("Valid Category ID is required"),
    body("lat")
        .isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
    body("lng")
        .isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),
    body("eventLocation")
        .notEmpty().withMessage("Location string is required"),
    body("subEvents")
        .isArray({ min: 1 }).withMessage("At least one sub-event is required"),
    body("subEvents.*.title")
        .notEmpty().withMessage("Sub-event title is required"),
    body("subEvents.*.startDate")
        .isISO8601().withMessage("Invalid start date format"),
    body("subEvents.*.endDate")
        .isISO8601().withMessage("Invalid end date format")
];