const errorHandler = (err, req, res, next) => {
    console.error(`🔥 Error: ${err.message}`); // Console pe error log karega

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

// 404 Handler (Unknown Routes)
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found!`,
    });
};

module.exports = { errorHandler, notFoundHandler };
