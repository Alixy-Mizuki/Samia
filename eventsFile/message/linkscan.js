let axios = require('axios');
/*
  [ 3 PRIVATE REGEX HERE ]
*/
let { MessageEmbed } = require('discord.js');
const { stripIndents, oneLine } = require('common-tags');

module.exports = {
  name: 'linkscan',
  listener: 'messageCreate',
  async run(client, message) {
    
    let websiteList = await database.get('website_ip_logger');    

    let checkLink = (link) => { return websiteList.some(sl => link.toString().includes(sl)) };
    
    try {
/*

[ 4000 LINES OF PRIVATE CODE HERE ]

*/  
      async function sendToModLog(redir, type, matched) {
        let channel = await client.channels.fetch('972172283122712576'); // link-log
        let author = message.author;
        
        if(!type) type = 'N/A';
        if(!redir) redir = 'N/A';
        if(!matched) matched = 'N/A';
        
        if(channel) {
          channel.send({ 
            embeds: [
              new MessageEmbed()
              .setTitle('Ip Logger Site detected')
              .setDescription(stripIndents`
                **User**
                ${author} | ${author.tag} | \`${author.id}\`

                **Link and Matched with**
                \`\`\`diff
                ${matched}
                \`\`\`
  
                **Type**
                \`\`\`yaml
                ${type}
                \`\`\`
  
                **Link Trace Route**
                \`\`\`diff
                ${redir}
                \`\`\`
              `)
              .setColor('RED')
            ]
          }).catch(err)
        }            
      }
    }
    catch(e) {
      print(e)
    }


  }
}
