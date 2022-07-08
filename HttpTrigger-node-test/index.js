module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log("---------------------------------\n"+JSON.stringify(req.body)+"\n---------------------------------\n");
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully. 날 봐 날 봐 귀순"
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response. 날 봐 날 봐 귀순";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };


}