// Webhook for LINE
function doPost(e) {  
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  var user_id= JSON.parse(e.postData.contents).events[0].source.userId;
  var user_name = get_profile(user_id);
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;
  postSlackMessage('LINE: ' + user_name + ' ```message: ' + user_message + '```');  
  
  
  var add_friend = JSON.parse(e.contentLength);
  
  //友達追加された時の動作
  if (add_friend == 174){
    var friend_id = JSON.parse(e.postData.contents).events[0].source.userId;
    var send_mes = "友達が追加されました" + friend_id; 
    postSlackMessage(send_mes);
  }
  //メッセージに元気と含まれていたら、元気ですと返す
  var token = PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN'); 
  if ( user_message.indexOf('元気') != -1 ) {
    var user_message2 = "元気";
    var bot_message = "BOT...(" + user_message2 + ")";
    postSlackMessage(bot_message); 
    var url = 'https://api.line.me/v2/bot/message/reply';
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + token,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': reply_token,
        'messages': [{
          'type': 'text',
          'text': user_message2,
        }],
      }),
    });
  } else{
    postSlackMessage('元気以外が送信された'); 
  }
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
