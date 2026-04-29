import User from "../model/user.js";
import HTTPError from '../util/HTTPError.js';


export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            throw new HTTPError(404, "User not found");
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const createUser = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await User.create({ firstName, lastName, email, password });
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new HTTPError(404, "User not found");
        }
        return res.status(200).json({
            message: "user deleted",
            user,
        });
    } catch (err) {
        next(err);
    }
}
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, avatar } = req.body;
        const user = await User.findById(id);

        if (req.user.userId !== id && req.user.role !== "admin") {
            throw new HTTPError(403, "Forbidden");
        }

        if (!user) {
            throw new HTTPError(404, "User not found");
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.avatar = avatar || user.avatar;


        await user.save();

        return res.status(200).json({
            message: "user updated",
            user,
        });

    } catch (err) {
        next(err);
    }
}