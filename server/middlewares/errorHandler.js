const errorHandler = (err,req,res,next) => {
        const statusCode = err.statusCode || 500
        const errMessage = err.message || 'Internal server error'
        if(err.message.includes("expired")) res.clearCookie("access_token").status(statusCode).json({
            success:false,
            statusCode,message:errMessage
        })
        else res.status(statusCode).json({
            success:false,
            statusCode,message:errMessage
        })
}

export default errorHandler