function doPost(e){
  if (e.parameter.text != undefined) {
    // Slack settings.
    var text = e.parameter.text.replace(/:line:/, '');
    var token = PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN'); 
    var user_id = PropertiesService.getScriptProperties().getProperty('USER_ID'); 
    var url = "https://api.line.me/v2/bot/message/push";
    var headers = {
      "Content-Type" : "application/json; charset=UTF-8",
      'Authorization': 'Bearer ' + token,
    };
    var postData = {
      "to" : user_id,
      "messages" : [
        {
          'type':'text',
          'text':text,
        }
      ]
    };   
    var options = {
      "method" : "post",
      "headers" : headers,
      "payload" : JSON.stringify(postData)
    };   
    var response = UrlFetchApp.fetch(url, options);  
  } else  {
    // LINE settings.
    var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
    var user_id= JSON.parse(e.postData.contents).events[0].source.userId;
    var user_name = get_profile(user_id);
    var user_message = JSON.parse(e.postData.contents).events[0].message.text;
    postSlackMessage('LINE: ' + user_name + ' ```message: ' + user_message + '```');  
  }
}

// Post Slack
function postSlackMessage(mes) {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_API'); 
  var slackApp = SlackApp.create(token);
  var options = {
    channelId: "#line-bot",
    userName: "LINE_BOT",
    message: mes
  };
  slackApp.postMessage(options.channelId, options.message, {username: options.userName});
}

// Get Profile of LINE
function get_profile(userid) {
  var token = PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN'); 
  var url = 'https://api.line.me/v2/bot/profile/' + userid;
  var headers = {
    'Authorization': 'Bearer ' + token
  };
  var options = {
    'headers' : headers
  };
  var response = UrlFetchApp.fetch(url, options);
  var content = JSON.parse(response.getContentText());  
  return content['displayName'];  
}
