let fs = require('fs');
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
    name: 'reload',
    description: 'Reload Commands',
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
        name: 'command',
        description: 'Reload slash command',
        type: 1,
        options: [
          {
            name: 'r_cmd',
            description: 'Command',
            type: 3,
            required: true,
            autocomplete: true
          }
        ]
      },
      {
        name: 'event',
        description: 'Reload events',
        type: 1,
        options: [
          {
            name: 'r_event',
            description: 'Event',
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
  commandType: 'owner', // owner | public
  async run(client, int) {
    if(!client.owner.some(u => u == int.user.id)) return int.reply('You are?');
    
    let Check = '✅';
    let XNO = '❌';
    
    let subCommand = int.options.getSubcommand();

    if(subCommand == 'command')
    {
      let command = int.options.getString('r_cmd');
      const SlashFolders = await fs.promises.readdir(`${process.cwd()}/commands`)
        .catch((err) => {return console.log(err);});
      
      const Fail = new MessageEmbed()
      .setTitle(`${XNO} Fail`)
      .setColor('RED')

      const Success = new MessageEmbed()
      .setTitle(`${Check} Success`)
      .setColor('GREEN')
      
      try 
      {      
        for (const subFolder of SlashFolders) 
        {
          const file = await fs.promises.readdir(`${process.cwd()}/commands/${subFolder}`)
          .catch((err) => { 
            return console.log(err);
          });

          const CMD = client.slashCommands.get(command)

          if (!CMD) 
          {
            return int.reply({ 
              embeds: [
                Fail.setDescription(`There is no Slash Commands with name \`${command}\``)
              ], 
              ephemeral: true 
            });
          }

          if (file.includes(`${CMD.data.name}.js`)) 
          {
            try 
            {
              let path = `../${subFolder}/${CMD.data.name}.js`;
              const tempCommand = require( path );
              let newCommand;
              try
              {
                await client.slashCommands.set(tempCommand.data.name+'1', tempCommand);
                newCommand = tempCommand;
                await client.slashCommands.delete(tempCommand.data.name+'1');
              } 
              catch(e) {
                return int.reply({ 
                  embeds: [
                    Fail.setDescription(`There was an error while reloading a CMD \`${command}\`:\n\`${e.message}\``)
                  ], 
                  ephemeral: true 
                });
              }
              
              delete require.cache[ require.resolve(path) ];
              client.slashCommands.delete(command);


              client.slashCommands.set(newCommand.data.name, newCommand);
              return int.reply({ 
                embeds: [
                  Success.setDescription(`\`${command}\` has been succesfully reloaded`)
                ], 
                ephemeral: true 
              });
            } 
            catch (error) 
            {
              return int.reply({ 
                embeds: [
                  Fail.setDescription(`There was an error while reloading a CMD \`${command}\`:\n\`${error.message}\``)
                ], 
                ephemeral: true 
              });
            }
            break;
          }
        }
      }
      catch (error) 
      {
        return int.reply({ 
          content: `${XNO} There was an error trying to reload **${command}**: \`${error.message}\``, 
          ephemeral: true 
        });
      }
      
    }
//====================
    if(subCommand == 'event') {
      let Event = int.options.getString('r_event');
      
      const EventsFolders = await fs.promises.readdir(`${process.cwd()}/eventsFile`)
        .catch((err) => {return console.log(err);});
      
      const Fail = new MessageEmbed()
      .setTitle(`${XNO} Fail`)
      .setColor('RED')

      const Success = new MessageEmbed()
      .setTitle(`${Check} Success`)
      .setColor('GREEN')
      
      try 
      {      
        for (const subFolder of EventsFolders) 
        {
          const file = await fs.promises.readdir(`${process.cwd()}/eventsFile/${subFolder}`)
          .catch((err) => { 
            return console.log(err);
          });

          const targetEvent = client.events.get(Event)

          if (!targetEvent) 
          {
            return int.reply({ 
              embeds: [
                Fail.setDescription(`There is no Event with name \`${targetEvent}\``)
              ], 
              ephemeral: true 
            });
          }

          if (file.includes(`${targetEvent.name}.js`)) 
          {
            try 
            {
              let path = `${process.cwd()}/eventsFile/${subFolder}/${targetEvent.name}.js`;
              const temp = require( path );
              let newEvent;
              try
              {
                await client.events.set(temp.name+'1', temp);
                newEvent = temp;
                await client.events.delete(temp.name+'1');
              } 
              catch(e) {
                return int.reply({ 
                  embeds: [
                    Fail.setDescription(`There was an error while reloading a event \`${Event}\`:\n\`${e.message}\``)
                  ], 
                  ephemeral: true 
                });
              }
              
              delete require.cache[ require.resolve(path) ];
              client.events.delete(targetEvent);


              client.events.set(newEvent.name, newEvent);
              return int.reply({ 
                embeds: [
                  Success.setDescription(`\`${Event}\` has been succesfully reloaded`)
                ], 
                ephemeral: true 
              });
            } 
            catch (error) 
            {
              return int.reply({ 
                embeds: [
                  Fail.setDescription(`There was an error while reloading a event \`${Event}\`:\n\`${error.message}\``)
                ], 
                ephemeral: true 
              });
            }
            break;
          }
        }
      }
      catch (error) 
      {
        return int.reply({ 
          content: `${XNO} There was an error trying to reload **${Event}**: \`${error.message}\``, 
          ephemeral: true 
        });
      }
      
    }

//====================    
  }
}