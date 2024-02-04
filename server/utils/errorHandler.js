const error = (status,message='Internal Server Error') => {
    const err = new Error()
    err.statusCode = status || 500
    err.message = message
    return err
}

export default error