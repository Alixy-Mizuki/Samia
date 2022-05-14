const { 
  MessageEmbed,
  MessageActionRow, 
  MessageButton,
  MessageSelectMenu,
  Util
} = require('discord.js');
const { stripIndents, oneLine } = require('common-tags');
const util = require('util')

let print = console.log
const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

module.exports = {
  data: {
    name: 'eval',
    description: 'Evaluate something',    
    type: 'CHAT_INPUT',
    defaultPermission: false,
/*
@type
CHAT_INPUT	  1	  Slash commands
USER	        2	  A UI-based command that shows up when you right click or tap on a user
MESSAGE       3	  A UI-based command that shows up when you right click or tap on a message

*/
    options: [
      {
        type: 3,
        name: 'input',
        description: 'Code?',
        required: true
      }
    ]
  },
    /**
     * @client           - Bot
     * @name                  - Command Name or Class Command Name, STRING
     * @type                  - Command Types, Integer
        {
          SUB_COMMAND       : 1
          SUB_COMMAND_GROUP : 2
          STRING	          : 3	
          INTEGER	          : 4	
          BOOLEAN	          : 5	
          USER	            : 6	
          CHANNEL	          : 7	
          ROLE	            : 8	
          MENTIONABLE	      : 9	
          NUMBER	          : 10
        }
    * @options               - Command Options, Array[Object]
    * @options.type          - Refer to @type
    * @options.value         - input from users, 
    * @options.focused       - true if this option is the currently focused option for autocomplete 
    * @options.autocomplete  - Boolean
    * @options.choices       - Command Options Choices, Object{ name, value }

    */
  commandType: 'owner', // owner | public
  async run(client, int) {
      
    if(!client.owner.some(u => u == int.user.id)) 
      return int.reply('WHo tf Are you?')

    const string = int.options.getString('input');

    const clean = async (text) => {

      if (text && text.constructor.name == "Promise") text = await text;

      if (typeof text !== "string") text = require("util").inspect(text, { depth: 1 });

      text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      text = text.replaceAll(client.token, "[REDACTED]");
      return text;
    }

    try {
      let Code = string;
      let evaled;

      // console.log(string, Code)
      if(Code.startsWith('```') && Code.endsWith('```')) Code = Code.replace(/(^.*?\s)|(\n.*$)/g, '')

      if(Code.includes("await")) evaled = eval("(async () => {" + Code + "})()");
      else evaled = eval(Code)

      const cleaned = await clean(evaled);

      let Splitted = Util.splitMessage(cleaned, { maxLength: 1800 })

      if(Splitted.length == 1) {
        return int.reply(`\`\`\`js\n${Splitted[0]}\n\`\`\``);
      }

      await int.reply(`\`\`\`js\n${Splitted[0]}\n\`\`\``);

      Splitted = Splitted.slice(1);
      let channel = int.member.guild.channels.cache.get(int.channelId)
      for(let cont of Splitted) 
      { 
        channel.send(`\`\`\`js\n${cont}\n\`\`\``);
      }
      return;
      
    } 
    catch (err) {
      int.reply(`\`ERROR\` \`\`\`xl\n${err.message}\n\`\`\``).catch(e=>console.log(e))
    }

  }
}