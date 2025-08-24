const {StatusCodes} = require("http-status-codes");

const ErrorHandlerMiddleware = (err, req, res, next) => {
    const GenericError = {
        StatusCode : err.status || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong try again later",
    };
    if (err.name === "ValidationError"){
        console.log("Attention")
        GenericError.message = err.message;
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

