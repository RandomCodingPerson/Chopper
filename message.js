config = require('../config.json')

module.exports = (client, message) => {
  if(message.author.bot) return;

//================Defining================\\
  const args = message.content.slice(1).trim().split(/ +/g);
  
  const command = args.shift().toLowerCase()
  
//=============Command Handling=============\\
  if (message.channel.type !== "dm") {
    var cmd = client.commands.get(command);
    
    client.commands.get("bullying")(client,message);
    if (cmd) {
      cmd(client, message, args);
    }
  } else {
    client.commands.get("chatbot")(client, message);
  }
  
}
