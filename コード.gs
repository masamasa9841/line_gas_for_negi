// Webhook for LINE
function doPost(e) {  
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  var user_id= JSON.parse(e.postData.contents).events[0].source.userId;
  var user_name = get_profile(user_id);
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;
  postSlackMessage('LINE: ' + user_name + ' ```message: ' + user_message + '```');  
}

// Slack
function postSlackMessage(mes) {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_API'); 
  var slackApp = SlackApp.create(token);
  var options = {
    channelId: "#random",
    userName: "LINE_BOT",
    message: mes
  };
  slackApp.postMessage(options.channelId, options.message, {username: options.userName});
}

// Get Profile for LINE
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
