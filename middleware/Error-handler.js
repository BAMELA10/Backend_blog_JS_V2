const {StatusCodes} = require("http-status-codes");

const ErrorHandlerMiddleware = (err, req, res, next) => {
    const GenericError = {
        StatusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong try again later",
    };
    //console.log(err.code + '  '+ err.error)
    if (err.name === "ValidationError"){
        GenericError.message = Object.values(err.errors)
        .map((items) => items.message)
        .join(',');
        GenericError.StatusCode = 400;

    };

    // Handling of Duplicate Error
    if(err.code || err.code == 11000){
        GenericError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue
          )} field, please choose another value`;
        GenericError.StatusCode = 400;
    };

    // Handling of Cast Error
    if (err.name == "CastError"){
        GenericError.message = `No item found with id : ${err.value}`;
        GenericError.StatusCode = 404;
    };

    return res.status(GenericError.StatusCode).json({ error:"true", message: GenericError.message });
}

module.exports = ErrorHandlerMiddleware;

