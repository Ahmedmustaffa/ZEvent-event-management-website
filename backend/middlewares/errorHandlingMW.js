export default (err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || "Internal server error";
    let errors = err.errors;

    if (err.code === 11000) {
        status = 400;
        let field = Object.keys(err.keyValue)[0];
        message = `${field} must be unique`;
    }
    if (err.name === "ValidationError") {
        status = 400;
        message = "Validation error";
        errors = Object.values(err.errors).map(e => e.message);
    }
    return res.status(status).json({
        status: "There are an error",
        message,
        errors
    });
}