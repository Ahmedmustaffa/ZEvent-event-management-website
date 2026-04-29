import Category from "../model/category.js";
import HTTPError from '../util/HTTPError.js';


export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            throw new HTTPError(404, "Category not found");
        }
        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
}

export const createNewCategory = async (req, res, next) => {
    const { name } = req.body;
    try {
        if (req.user.role !== "admin") {
            throw new HTTPError(403, "Forbidden");
        }
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
}

export const deleteCategory = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            throw new HTTPError(403, "Forbidden");
        }
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            throw new HTTPError(404, "Category not found");
        }
        return res.status(200).json({
            message: "category deleted",
            category,
        });
    } catch (err) {
        next(err);
    }
}

export const updateCategory = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            throw new HTTPError(403, "Forbidden");
        }
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findById(id);

        if (!category) {
            throw new HTTPError(404, "Category not found");
        }

        category.name = name || category.name;

        await category.save();

        return res.status(200).json(category);

    } catch (err) {
        next(err);
    }
}