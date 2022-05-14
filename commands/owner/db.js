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
    name: 'db',
    description: 'Database',
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
        name: 'db_show',
        type: 1,
        description: 'Show any saved database',
        options: [
          {
            name: 'db_s_target',
            description: 'pick a database',
            type: 3,
            autocomplete: true,
            required: true
          }
        ]
      }, 
      {
        name: 'db_update',
        type: 1,
        description: 'Update saved database',
        options: [
          {
            name: 'db_u_target',
            description: 'pick a database',
            type: 3,
            autocomplete: true,
            required: true
          },
          {
            name: 'update_to',
            description: 'Update the stuff to?',
            type: 3,
            required: true
          }
        ]
      }, 
      {
        name: 'db_push',
        type: 1,
        description: 'Push to an element to saved database',
        options: [
          {
            name: 'db_p_target',
            description: 'pick a database',
            type: 3,
            autocomplete: true,
            required: true
          },
          {
            name: 'push',
            description: 'Update the stuff to?',
            type: 3,
            required: true
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
  commandType: 'owner', // owner | public
  async run(client, int) {
    if(!client.owner.some(u => u == int.user.id)) return int.reply('You are?');
        
    let subCommand = int.options.getSubcommand();
    
    await int.deferReply({ ephemeral: true })

    if(subCommand == 'db_show') 
    {
      let query = int.options.getString('db_s_target')
      let datas = await database.get(query);
      if(!datas) return int.editReply('Database Not Found')

      datas = JSON.stringify(datas);

      return int.editReply({
        content: stripIndents`
\`\`\`yaml
${datas.toString()}
\`\`\`
      `
      , ephemeral: false })
    }
    if(subCommand == 'db_update') 
    {
      let query = int.options.getString('db_u_target')
      let updateTo = int.options.getString('update_to')
      let status;
      
      if(updateTo == 'reset') {
        status = await database.set(query, '');
      } else status = await database.set(query, updateTo)
      
      print(status)
      if(status) {
        int.editReply({ content: 'Data saved', ephemeral: false })
      } else int.editReply('Failed to update the data')
    }
    if(subCommand == 'db_push') 
    {
      let query = int.options.getString('db_p_target')
      let pushing = int.options.getString('push')

      let saved = await database.get(query);
      
      if(saved.includes(pushing)) {
        return int.editReply('The link already blacklisted')
      }
      
      let status = await database.push(query, pushing)
      print(status)
      if(status) {
        int.editReply({ 
          content: `${pushing} is added`, ephemeral: false
        })
      } else int.editReply('Failed to update the data')
    }
    
  }
}