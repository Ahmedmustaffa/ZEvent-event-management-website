import User from "../model/user.js";
import HTTPError from "../util/HTTPError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new HTTPError(401, "Invalid email or password");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );


        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            user
        });

    } catch (err) {
        next(err);
    }
}

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId, "-password");
        return res.status(200).json({ user });
    } catch (err) {
        next(err);
    }

}

export const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
};
