const Discord = require('discord.js')
const moment = require('moment')
const {MongoClient} = require('mongodb');
const url="mongodb+srv://vibhuvnarayansharma:Hl98XUoUAQLa4TKe@cluster0.gwuh81j.mongodb.net/";
const client = new MongoClient(url);
var request = require('request');

function ordinal_suffix_of(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 

module.exports = async (botClient, message, args) => {

    let warn = true;
    let del = true;
    let notif = true;
    let alert = true;
    let kick = false;
    let ban = false;

    user = message.author;

        await client.connect();
    
        await listDatabases(client);
     

    const db = client.db("montyhacks");
    //console.log("db", db)

    var prediction = 0;

    await request.post(
        'http://127.0.0.1:5000/predict',
        { json: { text: `${message.content}` } },
        async function (error, response, body) {
            if (!error && response?.statusCode == 200) {
                prediction = Number(body);
                console.log(prediction);
                if (prediction > 0) {
                    console.log('in');
            
                    guildID = message.guild.id;
            
                    const server = await db.collection("servers").findOne({}, {serverID: guildID}, {}) || {
                        opts: {
                            "Warn": false,
                            "Delete Message": false,
                            "Notify Owner": false,
                            "Alert Channel": false,
                            "Kick After (0 to not kick)": 0,
                            "Ban After (0 to not ban)": 0,
                        },
                    };
                    
                    let warn = server.opts['Warn']
                    let del = server.opts['Delete Message']
                    let notif = server.opts['Notify Owner']
                    let alert = server.opts['Alert Channel']
                    let kickL = Number(server.opts['Kick After (0 to not kick)']);
                    let banL = Number(server.opts['Ban After (0 to not ban)']);

                    let kick = (kickL > 0) ? (warn+1 >= kickL) : false;
                    let ban = (banL > 0) ? (warn+1 >= banL) : false;


                if (notif) {
                    const owner = await message.guild.owner;
                    embed = new Discord.MessageEmbed()
                    .setColor("#30dbe0")
                    .setAuthor(`Bullying alert in ${message.guild.name} from ${message.author.username}`)
                    .setDescription(`${message.content}`)
                    .setFooter(`User ID: ${message.author.id}`)
                    .setColor("RANDOM")
                    .setTimestamp();
            
                        owner.send({ embed: embed });
                }
            
                var warnNum = (server?.users) ? (server?.users[message.author.id]?.warns) : 0;
                if (!warnNum) {
                    warnNum = 0;
                }
            
                console.log('w', server, 'w', message.author.id, 'w' )
              
                users = server.users || {};
            
                    console.log(server);
            
                if (del) {
                    message.channel.bulkDelete(1);
                }

                if (kick) {
                    message.guild.member(message.author).kick("Detected bullying by Chopper!")
                }


                if (ban) {
                    message.guild.member(message.author).ban({ days: 7, reason: 'Detected bullying by Chopper!' })
                }

                if (warn) {
                    console.log(warnNum + 1);
                    console.log(warnNum, users)
                }

                users[message.author.id] = {
                    id: message.author.id,
                    warns: (warn) ? (warnNum + 1) : (warnNum),
                    username: message.author.username,
                    picture: message.author.displayAvatarURL()
                }
                console.log('u', users, message.author.id, warnNum)
                const query = {serverID: guildID};
                const doc = {
                    $set: {
                        serverID: guildID,
                        opts: {
                            "Warn": server.opts['Warn'],
                            "Delete Message": server.opts['Delete Message'],
                            "Notify Owner": server.opts['Notify Owner'],
                            "Alert Channel": server.opts['Alert Channel'],
                            "Kick After (0 to not kick)": server.opts['Kick After (0 to not kick)'],
                            "Ban After (0 to not ban)": server.opts['Ban After (0 to not ban)'],
                        },
                        users: users
                    }
                }
                const options = { upsert: true };
                db.collection("servers").updateOne(query, doc, options);
            
                if (alert && !kick && !ban) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor("Bullying detected")
                    .setDescription((warn) ? (`${user.username}, this is your ${ordinal_suffix_of(warnNum + 1)} warning.`) : (`Make sure to be thoughtful about what you send online!`))
                    .setColor("RANDOM")
                    .setTimestamp();
            
                sent = message.channel.send({ embed: embed });
                }
            }
            
            
            
            } else {
                console.log('e', error, 'stat', response?.statusCode,'b', body)
            }
        }
    );

    
};
