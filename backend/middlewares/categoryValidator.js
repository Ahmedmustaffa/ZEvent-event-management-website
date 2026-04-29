import { body } from "express-validator";

export const createCategoryValidator = [
    body("name")
        .trim().notEmpty().withMessage("category name is required")
        .isLength({ min: 2 }).withMessage("category name must be at least 2 characters").isLength({ max: 30 }).withMessage("category name must be at most 30 characters"),

]

export const updateCategoryValidator = [
    body("name")
        .trim().notEmpty().withMessage("category name is required")
        .isLength({ min: 2 }).withMessage("category name must be at least 3 characters").isLength({ max: 30 }).withMessage("category name must be at most 30 characters"),

];