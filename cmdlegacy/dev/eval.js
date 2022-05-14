const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageAttachment, Util } = require('discord.js');
const { stripIndents, oneLine } = require('common-tags');

module.exports = {    
  name: "eval", 
  category: "admin", // must match with folder name
  description: "Evaluate", 
  aliases: ['e'],
  guildOnly: true,
  devsOnly: true,
  userPermissions: [],
  clientPermissions: [],
  details: [],
  cooldown: 5, // seconds
  usage: [
    '<code>'
  ], // if args is true then this param required
  argsRequired: true,

  async run (client, message, args) {
    try
    {
      const clean = async (text) => {
        if (text && text.constructor.name == "Promise") text = await text;
        if (typeof text !== "string") text = require("util").inspect(text, { depth: 1 });
        text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        text = text.replaceAll(client.token, "[REDACTED]");
        return text;
      }
  
      try {
        let Code = args.join(" ")
        if(Code.startsWith('```') && Code.endsWith('```')) Code = Code.replace(/(^.*?\s)|(\n.*$)/g, '')
  
        if(Code.includes("await")) evaled = eval("(async () => {" + Code + "})()");
        else evaled = eval(Code)
  
        const cleaned = await clean(evaled);
  
        let Splitted = Util.splitMessage(cleaned, { maxLength: 1800 })
  
        
        for(let cont of Splitted) 
        { 
          message.channel.send(`\`\`\`js\n${cont}\n\`\`\``);
        }
        
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err.message}\n\`\`\``);
      }
      
//=================
    }
    catch(e)
    {
      print(e)
    }      
//=================
  }
}
