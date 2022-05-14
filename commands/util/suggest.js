const { 
  MessageEmbed,
  MessageActionRow, 
  MessageButton,
  MessageSelectMenu,
  Util
} = require('discord.js');
const { stripIndents, oneLine } = require('common-tags');
let print = console.log


module.exports = {
  data: {
    name: 'suggest',
    description: 'Suggest Something',
    type: 'CHAT_INPUT',
/*
@type
CHAT_INPUT	  1	  Slash commands
USER	        2	  A UI-based command that shows up when you right click or tap on a user
MESSAGE       3	  A UI-based command that shows up when you right click or tap on a message

*/
    options: [
      {
        name: 'message',
        type: 3,
        required: true,
        description: 'Message you want to suggest.'
      }
    ]
  },
    /**
     * @this.client           - Bot
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
  commandType: 'public', // owner | public
  async run(client, int) {

    let channel = int.guild.channels.cache.get('963516245892808734') || 
      int.guild.channels.cache.find(x => x.name.includes('suggest'));
    
    if(!channel) 
      return int.reply({ content: `Please Inform Staff Team that \`Suggest\` command can't find the suggestion channel` })

    let msg = int.options.getString('message')

    let embed = new MessageEmbed()
    .setAuthor({
      name: `${int.user.tag}'s suggestion`,
      iconURL: int.user.displayAvatarURL({ dynamic: true} )
    })
    .setDescription('>>> '+msg.slice(0,3950 ))
    .setColor('GREEN')
    .setFooter({ text: 'use /suggest to suggest your idea' })

    await channel.send({ embeds: [embed] }).catch(err)

    return int.reply({ content: 'Suggestion Sent', ephemeral: true })
    
  }
}