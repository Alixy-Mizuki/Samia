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
    name: 'invitemanager',
    description: 'Mange Invite codes',
    type: 'CHAT_INPUT',
    options: [
      {
        name: 'delete',
        description: 'delete given invite code',
        type: 1,
        options: [
          {
            name: 'im_code',
            description: 'insert invite code here',
            type: 3,
            required: true,
            autocomplete: true
          }
        ]
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
    
    if(!int.member.permissions.has('MANAGE_MESSAGES')) 
      return int.reply('Missing Permissions to use this command.')

    await int.deferReply();

    let code = int.options.getString('im_code');
    let seek = await int.guild.invites.fetch(code);
    if(!seek) 
      return int.editReply({ content: `code ${code} not found`, ephemeral: true })

    try { 
      await seek.delete()
      return int.editReply({ 
        content: `Code \`${seek.code}\` by \`${seek.inviter.tag}\` is deleted`, 
        ephemeral: true 
      })
    }
    catch(e) {
      print(e)
      return int.editReply({ content: e.message, ephemeral: true })
    }

    
  }
}