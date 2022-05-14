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
    name: 'embedbuilder',
    description: 'Build an embed',
    type: 'CHAT_INPUT',
/*
@type
CHAT_INPUT	  1	  Slash commands
USER	        2	  A UI-based command that shows up when you right click or tap on a user
MESSAGE       3	  A UI-based command that shows up when you right click or tap on a message

*/
    options: [
      {
        name: 'target_channel',
        description: 'Target channel where the embed will be sent',
        type: 7,
        required: true
      },
      {
        name: 'description',
        description: 'Description of the embed. Use \\n to make a new line',
        type: 3,
        required: true
      },
      {
        name: 'mention_user',
        description: 'Mention someone when sending',
        type: 6,
        required: false
      },
      {
        name: 'title',
        description: 'Title of the embed',
        type: 3,
        required: false
      },
      {
        name: 'color',
        description: 'Color of the embed',
        type: 3,
        required: false
      },
      {
        name: 'footer',
        description: 'Footer of the embed',
        type: 3,
        required: false
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
  commandType: 'owner', // owner | public
  async run(client, int) {

    if(!int.member.permissions.has('MANAGE_MESSAGES')) return int.reply({ 
      content: 'Missing permission.', ephemeral: true 
    })

    let title = int.options.getString('title');
    let desc = int.options.getString('description');
    let color = int.options.getString('color');
    let footer = int.options.getString('footer');
    let Member = int.options.getMember('mention_user');
    let channel = int.options.getChannel('target_channel');

    let currChannel = int.member.guild.channels.cache.get(int.channelId)

    desc = desc.split('\\n').join('\n');
    color = isNaN(color) ? color.toUpperCase() : color;

    let embed = new MessageEmbed()    
    .setDescription(desc.slice(0, 2000))
    
    if(title) embed.setTitle(title)
    if(color) embed.setColor(color)
    if(footer) embed.setFooter({ text: footer })  

    let buttonYes = new MessageButton().setStyle('SUCCESS').setLabel('Send Embed').setCustomId('yes')
    let buttonNo = new MessageButton().setStyle('DANGER').setLabel('Abort').setCustomId('no')

    let row = new MessageActionRow().addComponents([buttonYes, buttonNo])

    let msgWMP = (!Member) ? 
      ({ embeds: [embed], components: [row], ephemeral: true }) : 
      ({ content: Member.user.toString(), embeds: [embed], components: [row], ephemeral: true })
    
    await int.reply(msgWMP)

    let filter = (i) => i.user.id == int.user.id;

    let C = await currChannel.createMessageComponentCollector({ filter, max: 1 })
    
    C.on('collect', async (i) => {
      if(i.isButton()) {
        switch(i.customId) {
          case 'yes':
            // 
            let msgWM = (!Member) ? ({ embeds: [embed] }) : ({ content: Member.user.toString(), embeds: [embed] })

            
            await channel.send(msgWM)
            await i.update({ 
              embeds: [
                new MessageEmbed().setTitle('Success').setColor('GREEN')
              ],
              components: [] 
            })
            break;
          case 'no':
            await i.update({ 
              embeds: [
                new MessageEmbed().setTitle('Aborted').setColor('GREEN')
              ],
              components: [] 
            })
            break;
          default:
            break;
        }
      }
    }).on('end', (i) => {
      if(i.size < 1 && int) {
        int.update({ components: [] }).catch(e => print(e))
      }
    })

    
  }
}