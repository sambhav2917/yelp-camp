class ExpressError extends Error{
    constructor(message,statusCode){
        super()                  //call the error constructor
        this.message=message;
        this.statusCode=statusCode;
    }
}

module.exports = ExpressError;