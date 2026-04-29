import { Router } from "express";

import {
    getAllCategories,
    createNewCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
} from "../controllers/category.controller.js";

import {
    createCategoryValidator,
    updateCategoryValidator,
} from "../middlewares/categoryValidator.js";

import validateResults from "../middlewares/validateResults.js";

import { idParamValidator } from "../middlewares/MongoIdValidator.js";

import { protect } from "../middlewares/authMW.js";


const router = Router();

router.get("/", getAllCategories);
router.post("/", createCategoryValidator, validateResults, protect, createNewCategory);
router.put("/:id", updateCategoryValidator, validateResults, protect, updateCategory);//u
router.delete("/:id", idParamValidator, validateResults, protect, deleteCategory);//d
router.get("/:id", idParamValidator, validateResults, getCategoryById);

export default router;