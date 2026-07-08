import jwt from "jsonwebtoken";
import { verifyJwtToken } from "../utils/genrateToken.js";

// 1. Strict Authentication Middleware
function verifyUser(req, res, next) {
    const authorizationHeader = req.headers.authorization;
   

    if (!authorizationHeader) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    const token = authorizationHeader.split(' ')[1];
    
    try {
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "please sign up or login"
            });
        }

        let user = verifyJwtToken(token);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "token is not valid "
            });
        }

        console.log("Strict auth: everything is fine");
        req.user = user.id;
        console.log(req.user);
        next(); // Call next inside the try block or right after it safely
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something broke while auth middleware"
        });
    }
}

// 2. Optional Authentication Middleware
function verifyUserOptional(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    // console.log("Optional Auth Header:", authorizationHeader);

    if (!authorizationHeader) {
        req.user = undefined;
        return next();
    }

    const token = authorizationHeader.split(' ')[1];

    try {
        if (!token) {
            req.user = undefined;
            return next();
        }

        let user = verifyJwtToken(token);

        if (!user) {
            req.user = undefined;
            return next();
        }

        req.user = user.id;
        next();
    } catch (error) {
        // If JWT decoding crashes, gracefully degrade to guest status instead of throwing a 500
        req.user = undefined;
        next();
    }
}

// ✅ Correct Export Layout
export { verifyUser as default, verifyUserOptional };