const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');
const { stripIndents, oneLine } = require('common-tags');

module.exports = {    
  name: "ping", 
  category: "basic", // must match with folder name
  description: "Bot's latency", 
  aliases: [],
  guildOnly: false,
  devsOnly: false,
  userPermissions: [], 
  clientPermissions: [], 
  details: [],
  cooldown: 5, // seconds
  usage: [], // if args is true then this param required
  argsRequired: false,

  async run (client, message, args) {
    try
    {
      const ping = new MessageEmbed()
      .setColor('RANDOM')
        
      message.channel.send({ 
        embeds: [
          ping.setDescription("**🏓 Pong! 🏓**")
          .addFields(
            {
              name:'Message Round-trip is',
              value: `\`${Date.now() - message.createdTimestamp}ms\``
            },
            {
              name:'Bot Latency is',
              value: `\`${Math.round(client.ws.ping)}ms\``
            }
          )
        ] 
      })
//=================
    }
    catch(e)
    {
      print(e)
    }      
//=================
  }
}

    