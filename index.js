//==============KEEP ALIVE==============\\
const express = require('express');
var bodyParser = require('body-parser'); 
var ejs = require("ejs");

const server = express();

server.set('view engine', 'html');
server.engine('html', ejs.renderFile);
server.use('/static', express.static('static'))

server.use(bodyParser.json());

//=================PROPS=================\\

//=================MONGODB IMPORTS
const {MongoClient} = require('mongodb');
const url="mongodb+srv://vibhuvnarayansharma:Hl98XUoUAQLa4TKe@cluster0.gwuh81j.mongodb.net/";
const mclient = new MongoClient(url);

//=================MONGODB
const db = mclient.db("montyhacks");

(async() => {

  const serverData = await db.collection("servers").findOne({}, {guildID: "1241506564611903629"}, {})

  server.get('/', (req, res) => {
    res.render("index.html", {
      serverData: serverData
    })
  });

  server.get('/bymember', (req, res) => {
    res.render("bullies.html", {
      serverData: serverData
    })
  });

//================== API =================\\

  server.post('/api/updateSettings', async function (req, res) {
    console.log(req.body);
    opts = req.body;
    console.log('in', opts, req.query, req.params)
    Object.keys(opts).forEach((x, index) => {
      const query = {serverID: "1241506564611903629"};
      const data = serverData;
      data.opts[`${x}`] = opts[x];
      doc = {
        $set: data
      };
      const options = { upsert: true };
      console.log("THIS IS THE DOC", opts, serverData, doc);
      db.collection("servers").updateOne(query, doc, options);
    })
  });

})()


//=================LISTEN=================\\

server.listen(4000, () => {
	console.log('Server is Ready!');
});


//=================IMPORT=================\\
const Discord = require('discord.js');

const client = new Discord.Client();

var { readdirSync } = require('fs');

config = require('./config.json'); 

client.commands = new Discord.Collection();

//=============COMMAND HANDLER=============\\
async function chStart() {
 for(const file of readdirSync('./commands/')) {
	
    if(!file.endsWith(".js")) return; 
  
    var fileName = file.substring(0, file.length - 3);

    var fileContents = require(`./commands/${file}`);
  
    client.commands.set(fileName, fileContents);
  }
}
chStart()
//==============EVENT HANDLER==============\\

async function ehStart() {
for(const file of readdirSync('./events/')) {
	
  if(!file.endsWith(".js")) return;
  
  var fileName = file.substring(0, file.length - 3);
  
  var fileContents = require(`./events/${file}`);

  client.on(fileName, fileContents.bind(null, client));
  
  delete require.cache[require.resolve(`./events/${file}`)];
}
}
ehStart()

//==================LOGIN==================\\
console.log('here')
client.login("MTI0MTM2MTQzNjkyMDM4MTQ1MA.GI6l_U.cL1xe2CYSPd1RyWVoLdUWD069TdqYETuP6jSp8")
  .then((err) => {
    
    console.log(`Client logged in as ${client.user.tag}`); 
  })
  .catch((err) => {
    console.error("Error while logging in: " + err);
    
  });