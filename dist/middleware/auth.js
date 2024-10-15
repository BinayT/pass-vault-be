"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const generateJWTToken_1 = require("@utils/generateJWTToken");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, generateJWTToken_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: 'Forbidden' });
    }
};
exports.authenticateJWT = authenticateJWT;
