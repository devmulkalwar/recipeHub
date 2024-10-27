import { hashPassword } from '../utils/passwordUtils.js';

export const hashPassMiddleware = async (req, res, next) => {
    if (req.body.password) {
        req.body.password = await hashPassword(req.body.password);
    }
    next();
};
