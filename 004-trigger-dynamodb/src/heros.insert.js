const uuid = require('uuid')
const Joi = require('@hapi/joi')
const decoratorValidator = require('./util/decoratorValidator')
const globalEnum = require('./util/globalEnum')

class Handler{
    constructor({dynamoDbService}){
        this.dbService = dynamoDbService
        this.dynamodbTable = process.env.DYNAMODB_TABLE
    }

    static validator(){
        return Joi.object({
            nome: Joi.string().max(100).min(2).required(),
            poder: Joi.string().max(20).required()
        })
    } 

    async insertItem(params){
        return this.dbService.put(params).promise()
    }

    prepareData(data){
        const params = {
            TableName: this.dynamodbTable,
            Item:{
                ...data,
                id: uuid.v1(),
                createdAt: new Date().toISOString()
            }
        }
        return params;
    }
    handlerSuccess(data){
      return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    }

    handlerError(data){
      return {
            statusCode: data.statusCode || 501,
            headers: {'ontent-Type': 'text/plain'},
            body:'Couldn\'t create item'
        }
    }

    async main(event){
        try {
            //event alredy change in decorator
            const data = event.body
            const dbParams = this.prepareData(data)
            await this.insertItem(dbParams)
            return this.handlerSuccess(dbParams.Item)
        } catch (error) {
            console.log(error)
            return this.handlerError({statusCode:500})
        }
    }
}

//factory
const AWS = require( 'aws-sdk' )
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const handler = new Handler({
    dynamoDbService: dynamoDB
});
module.exports = decoratorValidator(
    handler.main.bind(handler),
    Handler.validator(),
    globalEnum.ARGS_TYPE.BODY
) 