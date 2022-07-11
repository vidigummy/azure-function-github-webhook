module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');


    // var _ = require('underscore');

    // context.log("---------------------------------\n"+JSON.stringify(req)+"\n---------------------------------\n");
    var cloudEventObj = new Object();
    const obj = req.body;
    const tmp = '"created"';
    cloudEventObj.action = JSON.stringify(obj.action);
    context.log(cloudEventObj.action);
    context.log(typeof cloudEventObj.action);

    if(cloudEventObj.action == '"created"'){
        context.log("created!");
        const action_type = "comment";
        const action_id = obj.comment.id;
        const actor_id = obj.sender.id;
        const action_time = obj.comment.created_at;
    }else if(cloudEventObj.action == '"submitted"'){
        context.log("Review submitted!")
    }else if(cloudEventObj.action == '"opened"'){
        context.log("opened!")
    }else if(cloudEventObj.action == '"closed"'){
        context.log("closed!");
    }else{
        context.log(typeof cloudEventObj.action);
        context.log(typeof tmp);
        context.log(cloudEventObj.action.length);
        context.log(tmp.length);
        context.log("잘 수 없어.");
    }
    

    const name = (req.query.name || (req.body && req.body.name));

    const responseMessage = name
    
        ? "Hello, " + name + ". This HTTP triggered function executed successfully. 날 봐 날 봐 귀순"
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response. 날 봐 날 봐 귀순";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };


}