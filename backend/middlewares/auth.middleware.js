import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

export const isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user"
            });
        }
        req.user = user; // Attach user info to request object
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }

}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admins only."
        });
    }
    next();
}