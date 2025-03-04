// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.error(`🔥 Error: ${err.message}\n${err.stack}`) // Better logging

    // Set status code (default 500 if not provided)
    const statusCode = err.status || 500

    res.status(statusCode).json({
        success: false, // Useful for API responses
        error: 'Something went wrong!',
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Show stack only in development
    })
}

module.exports = errorHandler
