'use strict';
const { promises: { readFile } } = require('fs')
class Handler{

  constructor({rekoService, translatorService}){
    this.rekoService = rekoService;
    this.translatorService = translatorService;
  }

  async detectImageLabels(buffer){
    const result = await this.rekoService.detectLabels({
      Image:{
        Bytes: buffer
      }
    }).promise()
    const workingItems = result.Labels
      .filter(({Confidence}) => Confidence > 80);

    const names = workingItems
      .map(({ Name }) => Name)
      .join(' and ')

      return { names, workingItems }
  }

  async translateText(text){
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    }

    const result = await this.translatorService
                                .translateText(params)
                                .promise()
    console.log(JSON.stringify(result));
  }

  async main(event){
    try {
  
      const imgBuffer = await readFile('./img/scorpion.jpeg')
      
      console.log('Detecting labels...')
      const {names, workingItems} = await this.detectImageLabels(imgBuffer)

      console.log('Translating to Portuguese...')
      const texts = await this.translateText(names)

      return {
        statusCode:200,
        body:'Hello Everyone!'
      }
      
    } catch (error) {
      return {
        statusCode:500,
        body:'internal server error!'
      }
    }
  }
}

//factory
const aws = require('aws-sdk')
const reko = new aws.Rekognition()
const translator = new aws.Translate()

const handler = new Handler({
  rekoService: reko,
  translatorService: translator
})

module.exports.main = handler.main.bind(handler)