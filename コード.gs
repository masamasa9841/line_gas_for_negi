// Webhook for LINE
function doPost(e) {
  var token = PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN'); 
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  var user_id= JSON.parse(e.postData.contents).events[0].source.userId;
  var group_id= JSON.parse(e.postData.contents).events[0].source.groupId;
  if (user_id != undefined ) {
    var profile = get_profile(user_id);
  }
  switch (JSON.parse(e.postData.contents).events[0].type) {
    case 'follow': // follow event
      postSlackMessage('Followed', profile['displayName'] ,profile['pictureUrl']);
      break;
      
    case 'unfollow': //unfollo event
      postSlackMessage('Unollowed', profile['displayName'] ,profile['pictureUrl']);
      break; 
      
    case 'join': //join event
      postSlackMessage('Join group: ' + group_id);
      break; 
      
    case 'leave': //leave event
      postSlackMessage('Leave group: ' +  group_id);
      break; 
      
    case 'message': //message event
      var user_message = JSON.parse(e.postData.contents).events[0].message.text;
      postSlackMessage(user_message, profile['displayName'] ,profile['pictureUrl']);
      
      if ( user_message.indexOf('元気') != -1 ) {
        var bot_message = "元気です";
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
              'text': bot_message,
            }],
          }),
        });
      } else{
        // 指定文章以外をこ↑こ↓に書く
      }    
      
    default:
      break;
  }
  
}

// Send Slack
function postSlackMessage(mes, name, image_url) {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_API'); 
  var slackApp = SlackApp.create(token);
  if (name == undefined){
    name = 'LINE_BOT';
  }
  var options = {
    channelId: "#random",
    userName: name,
    message: mes,
    url: image_url
  };
  if (image_url == undefined){
    slackApp.postMessage(options.channelId, options.message, {username: options.userName});
  } else {
    slackApp.postMessage(options.channelId, options.message, {username: options.userName, icon_url: options.url});
  }
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
  return content;  
}
