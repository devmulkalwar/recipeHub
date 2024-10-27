export const sendResponse = (res, status, message, data) => {
    res.status(status).json({ message, data });
};
