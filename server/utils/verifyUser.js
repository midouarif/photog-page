import jwt from 'jsonwebtoken';
import { errorhandler } from '../utils/error.js';


export const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(errorhandler(401, "You need to login"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorhandler(403, "Token is not valid"));
        }
        req.user = user;
        next();
    });
}