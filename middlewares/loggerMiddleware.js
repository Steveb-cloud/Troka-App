export const loggerMiddleware = (req, res, next) => {
    const user = req.userId || 'anónimo';
    console.log(`[LOG] ${req.method} ${req.originalUrl} - Usuario: ${user}`);
    next();
};
