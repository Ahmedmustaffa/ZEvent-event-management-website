import jwt from "jsonwebtoken";
import HTTPError from "../util/HTTPError.js";

export const protect = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new HTTPError(401, "Not authenticated"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return next(new HTTPError(401, "Invalid or expired token"));
    }
};