module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const cloudEventObj = new Object();
    const obj = req.body;
    const obj_header = req.headers;
    
    // header dup 방지를 위한 hook-id 수집 
    cloudEventObj.hook_id = JSON.stringify(obj_header["x-github-hook-id"]).replace(/['"]+/g, '');

    // .replace(/['"]+/g, '') <- double quote problem solve (e.g. "\"hi\"")
    // 공통 부분 작성 (어디에서 왔는지 / 무슨 행동인지 / 행위자는 누구인지 / Organization id(이름 추가 가능) / repository id(이름도 추가 가능) / data_content_type )
    cloudEventObj.source = '"github"'.replace(/['"]+/g, '');
    cloudEventObj.action = JSON.stringify(obj.action).replace(/['"]+/g, '');
    cloudEventObj.actor_id = JSON.stringify(obj.sender.id);
    cloudEventObj.org_id = JSON.stringify(obj.organization.id);
    cloudEventObj.repo_id = JSON.stringify(obj.repository.id);
    cloudEventObj.data_content_type = '"text/xml"'.replace(/['"]+/g, '');

    // 이 부분은 Event 종류별로 객체를 가져올 수 있는 것이 다르기 때문에, 분기문으로 작성했다. 성의없이 하드코딩하는게 미안하긴 한데.... 어쩔 수 없다고 생각한다. 견뎌라.
    if(cloudEventObj.action == 'created'){
        // comment 발생 시
        // context.log(JSON.stringify(obj.issue));
        // action의 타입(created라고 하면 못 알아 듣는다.) / action_time(comment를 단 시간) / pr_url(pr이 달린 시각))
        cloudEventObj.action_type = 'comment';

        cloudEventObj.action_time = JSON.stringify(obj.comment.created_at).replace(/['"]+/g, '');

        cloudEventObj.pr_url = JSON.stringify(obj.issue.pull_request.url).replace(/['"]+/g, '');

    }else if(cloudEventObj.action == 'submitted'){
        // code review  발생 시
        // action의 타입(코드 리뷰를 뜻한다.) / 발생 시각 / review가 있는 pr의 url / review가 있는 pr의 id / review가 달린 commit의 id / review의 결과(comment/approve/request change)
        // approve 옵션을 할 경우, submit이 두번 요청됨.(state를 추가한다.)
            // Comment : 승인과 무관하게 일반적인 커멘트를 할 때 선택한다.
            // Approve : Comment와 다르게 리뷰어가 승인을 하는 것으로, 머지해도 괜찮다는 의견을 보내는 것이다. <- 두 번 보내짐.
            // Request changes : 말 그대로 변경을 요청하는 것으로, 승인을 거부하는 것을 뜻한다.
        cloudEventObj.action_type = 'review';
        cloudEventObj.action_time = JSON.stringify(obj.review.submitted_at).replace(/['"]+/g, '');
        cloudEventObj.pr_url = JSON.stringify(obj.review.pull_request_url).replace(/['"]+/g, '');
        cloudEventObj.pr_id = JSON.stringify(obj.pull_request.id).replace(/['"]+/g, '');
        cloudEventObj.commit_id = JSON.stringify(obj.review.commit_id).replace(/['"]+/g, '');
        cloudEventObj.state = JSON.stringify(obj.review.state).replace(/['"]+/g, '');

    }else if(cloudEventObj.action == 'opened'){
        // PR Opened 발생 시
        // commits들에 대한 정보는 Parser에서 받아서 처리하는 것으로 진행할 예정.
        // action_type, action_id(pr의 id / 이름도 추가 가능하다.), action_time, commits_url, commits_cnt 를 가져올 것이다. 
        context.log("opened!")
        cloudEventObj.action_type = 'pull_request';
        cloudEventObj.action_id = JSON.stringify(obj.pull_request.id).replace(/['"]+/g, '');
        cloudEventObj.action_time = JSON.stringify(obj.pull_request.created_at).replace(/['"]+/g, '');
        cloudEventObj.commits_url = JSON.stringify(obj.pull_request.commits_url).replace(/['"]+/g, '');
        cloudEventObj.commits_cnt = JSON.stringify(obj.pull_request.commits).replace(/['"]+/g, '');
        cloudEventObj.commits_label = JSON.stringify(obj.pull_request.head.label).replace(/['"]+/g, '');
        cloudEventObj.commits_branch = JSON.stringify(obj.pull_request.head.ref).replace(/['"]+/g, '');
    }else if(cloudEventObj.action == 'closed'){
        // PR Closed(Merged, Reject 후 폐기)
        context.log("closed!");
        const merged = JSON.stringify(obj.pull_request.merged_at);
        context.log(merged);
        if(merged == 'null'){
            context.log("Closed, but not merged.");

        }else{
            context.log("Closed, with merged.");
        }
    }else{
        // push의 경우에 가능함을 확인함.
        context.log(cloudEventObj.action);
        context.log("잘 수 없어.");
    }

    context.log(JSON.stringify(cloudEventObj));
    

    const name = (req.query.name || (req.body && req.body.name));

    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully. 날 봐 날 봐 귀순"
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response. 날 봐 날 봐 귀순";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };


}