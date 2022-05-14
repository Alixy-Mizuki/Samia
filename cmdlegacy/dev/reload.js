const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');
const { stripIndents, oneLine } = require('common-tags');
let fs = require('fs')

module.exports = {    
  name: "reload", 
  category: "dev", // must match with folder name
  description: "reload commands", 
  aliases: ['r', 'rel'],
  guildOnly: true,
  devsOnly: true,
  userPermissions: [], 
  clientPermissions: [], 
  details: [],
  cooldown: 5, // seconds
  usage: [
    '<commandName>'
  ], // if args is true then this param required
  argsRequired: true,

  async run (client, message, args) {
    try
    {
      const Arguments = args[0].toLowerCase();
      const RE = new MessageEmbed();

      let CHKMARK = '✅'
      let XNO = '❌'

      const Folders = await fs.promises.readdir('./cmdlegacy')
        .catch((err) => {return console.log(err);});

      if (Arguments === 'all') 
      {
        for (const Folder of Folders) 
        {
            const FILES = await fs.promises.readdir(`./cmdlegacy/${Folder}`)
              .catch((err) => {return console.log(err);});

            for (const FILE of FILES) {
              const CMDName = FILE.split('.')[0].toLowerCase();
              
              try {
                let newRes;
                try {
                  let file = require(`../${Folder}/${FILE}`);
                  client.commands.set(file.name+'1', file);
                  
                  newRes = file;
                  client.commands.delete(file.name+'1', file);
                } 
                catch(e) {
                  return message.channel.send(`Error Occured: ${e.message}`)
                }
  
                delete require.cache[require.resolve(`../${Folder}/${FILE}`)];
                client.commands.delete(CMDName);

                client.commands.set(newRes.name, newRes);
              } catch (error) {
                console.error(error);
                  RE.setTitle(`${XNO} Error`)
                  RE.setDescription(`There was an error while reloading a CMD \`${CMDName}\`:\n\`${error.message}\``)
                  RE.setColor('RED');
                return message.reply({ embeds: [RE] });
              }
            }
          }
            RE.setTitle(`${CHKMARK} Succesfully Reload All Commands`)
            RE.setColor('#00ff77')
            RE.setDescription('All commands has been reloaded');
          return message.reply({ embeds: [RE] });
        }
        

        const R_CMD = [];
        const R_FOLDER = [];

        for (const arg of args) 
        {
          const LCA = arg.toLowerCase();

          for (const Folder of Folders) 
          {
            const FILES = await fs.promises.readdir(`./cmdlegacy/${Folder}`).catch((err) => {return console.log(err);});

            if (Folder === LCA) {
              for (const FILE of FILES) {
                const CMDName = FILE.split('.')[0].toLowerCase();
                
                delete require.cache[require.resolve(`../${Folder}/${FILE}`)];
                client.commands.delete(CMDName);

                try 
                {
                  const NEWCMD = require(`../${Folder}/${FILE}`);
                  message.client.commands.set(NEWCMD.name, NEWCMD);
                } catch (error) {
                  console.error(error);
                  RE.setTitle(`${XNO} Error`)
                  RE.setDescription(`There was an error while reloading a CMD \`${CMDName}\`:\n\`${error.message}\``)
                  RE.setColor('RED');
                  return message.reply({ embeds: [RE] });
                }
              // console.log(FILE)
              }
              R_FOLDER.push(Folder);
              break;
            } else if (Folders.includes(LCA)) {
              continue;
            }

            const CMDName = LCA;
            const CMD = message.client.commands.get(CMDName) || message.client.commands.find(cmdlegacy => cmdlegacy.aliases && cmdlegacy.aliases.includes(CMDName));

            if (!CMD) 
            {
              RE.setTitle(`${XNO} Fail`)
              RE.setColor('RED')
              RE.setDescription(`There is no CMD with name or alias \`${CMDName}\``);
              return message.reply({ embeds: [RE] });
            }

            if (FILES.includes(`${CMD.name}.js`)) 
            {
              delete require.cache[require.resolve(`../${Folder}/${CMD.name}.js`)];
              client.commands.delete(CMDName);

              try 
              {
                const NEWCMD = require(`../${Folder}/${CMD.name}.js`);
                message.client.commands.set(NEWCMD.name, NEWCMD);
                R_CMD.push(NEWCMD.name);
              } 
              catch (error) 
              {
                console.error(error);
                RE.setTitle(`${XNO} Fail`)
                RE.setDescription(`There was an error while reloading a CMD \`${CMDName}\`:\n\`${error.message}\``)
                RE.setColor('RED');
                return message.reply({ embeds: [RE] });
              }
              break;
            }
          }
        }

        let SCK = new MessageEmbed()
        .setTitle(`${CHKMARK} Success`)
        .setColor('#00ff77');


        if (R_CMD.length && R_FOLDER.length) 
        {
          SCK.setDescription(`All commands in \`${R_FOLDER.join(', ')}\` Folders and CMD \`${R_CMD.join(', ')}\`  has been succesfully reloaded`)
          return message.reply({ embeds: [SCK] });
        }

        if (R_CMD.length) 
        {
          SCK.setDescription(`\`${R_CMD.join(', ')}\` has been succesfully reloaded`)
          return message.reply({ embeds: [SCK] });
        }

        if (R_FOLDER.length) 
        {
          SCK.setDescription(`All commands in \`${R_FOLDER.join(', ')}\` has been succesfully reloaded`)
          return message.reply({ embeds: [SCK] });
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