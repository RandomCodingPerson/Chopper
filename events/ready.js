module.exports = (client) => { 
	
    if(!client.user.bot) { console.log(`${client.id} is self-botting`); return process.exit() };
    
    client.user.setActivity('for !help', { type: 'WATCHING' });
  
  }