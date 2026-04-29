import { validationResult } from "express-validator";
import HTTPError from "../util/HTTPError.js";

export default (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const customError = new HTTPError(400, "Validation Error");
        customError.errors = errors.array();
        next(customError);
    }
    next();
}