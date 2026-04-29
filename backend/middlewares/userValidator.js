import { body } from "express-validator";

export const createUserValidator = [
    body("firstName")
        .trim().notEmpty().withMessage("First name is required")
        .isLength({ min: 3 }).withMessage("First name must be at least 3 characters"),
    body("lastName")
        .trim().notEmpty().withMessage("Last name is required")
        .isLength({ min: 3 }).withMessage("Last name must be at least 3 characters"),
    body("email")
        .trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email")
        .normalizeEmail(),
    body("password")
        .trim().notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")

]

export const updateUserValidator = [
    body("firstName")
        .trim().notEmpty().withMessage("First name is required")
        .isLength({ min: 3 }).withMessage("First name must be at least 3 characters"),
    body("lastName")
        .trim().notEmpty().withMessage("Last name is required")
        .isLength({ min: 3 }).withMessage("Last name must be at least 3 characters"),
];