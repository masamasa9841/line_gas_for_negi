function doPost(e){

  var text = e.parameter.text.replace(/:line:/, '');
  
  postSlackMessage(text);
}

// Slack
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