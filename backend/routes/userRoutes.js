import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser

} from "../controllers/user.controller.js";

import {
    protect
} from "../middlewares/authMW.js";

import {
    createUserValidator,
    updateUserValidator,
} from "../middlewares/userValidator.js";

import validateResults from "../middlewares/validateResults.js";

import { idParamValidator } from "../middlewares/MongoIdValidator.js";

const router = Router();

router.get("/", protect, getAllUsers);

router.post("/", createUserValidator, validateResults, createUser);

router.put("/:id", updateUserValidator, validateResults, protect, updateUser);

router.delete("/:id", idParamValidator, validateResults, protect, deleteUser);

router.get("/:id", idParamValidator, validateResults, protect, getUserById);



export default router;