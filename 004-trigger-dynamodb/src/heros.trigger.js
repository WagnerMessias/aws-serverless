class Handler{
    async main(event){
        console.log(
            'Event***', JSON.stringify(
                event,
                null,
                2
            )
        )
        return {
            statusCode: 200,
            body: 'success!'
        }
    }
}


const handler = new Handler()

module.exports = handler.main.bind(handler)