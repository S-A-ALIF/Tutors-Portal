const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        status: 500,
        message: 'An unexpected error occurred!',
        error: err.message 
    });
}

export default errorHandler;