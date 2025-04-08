const {StatusCodes} = require('http-status-codes');

const ErrorHandlerMiddleware = (err, req, res) => {
    const GenericError = {
        StatusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERRROR,
        message: err.msg || "Something went wrong try again later",
    };

    if (err.name === "ValidationError"){
        GenericError.msg = Object.values(err.error)
        .map((items) => items.message)
        .join(',');

        GenericError.StatusCode = 400;

    };

    // Handling of Duplicate Error
    if(err.code || err.code === 11000){
        GenericError.msg = `Duplicate value entered for ${Object.keys(
            err.keyValue
          )} field, please choose another value`;
        GenericError.statusCode = 400;
    };

    // Handling of Cast Error
    if (err.name === "CastError"){
        GenericError.msg = `No item found with id : ${err.value}`;
        GenericError.StatusCode = 404;
    };

    return res.status(GenericError.statusCode).json({ msg: GenericError.msg });
}

module.exports = ErrorHandlerMiddleware;

