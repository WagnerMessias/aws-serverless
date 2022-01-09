const decoratorValidator = (fn, schema, argsType) => {
    return async function (event) {
        const data = JSON.parse(event[argsType])
        //abortEarly == show all errors at once
        const {error, value} = await schema.validate(
            data,{abortEarly:true})

        if(!error){
            //It change instace of arguments
            event[argsType] = value
            //"arguments" get all argumnets that come from function and send it ahead
            //The "apply"  update the function that it will running after
            return fn.apply(this,arguments)
        }else{
            return {
                statusCode: 422, // unprocessable entity
                body: error.message
            }
        }

    }
}

module.exports = decoratorValidator 

/*const {error, value} = await Handler.validator().validate(data)
console.log({
    error,
    value
})*/