const D = require('discord.js')
const { stripIndents, oneLine } = require('common-tags');

module.exports = {
  name: 'newMember',
  listener: 'guildMemberAdd',
  async run(client, member) {

    // if member account is too young.
    function Ago(date) {
      if(!date) throw new ReferenceError('The date is not defined')
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return days; // returns number
    }

    let AccountAge = Ago(member.user.createdAt);
    let Limit = 14; // day
    let LessThan = parseInt(AccountAge) <= Limit;
    
    if(LessThan && !member.user.bot) {
      let chl = member.guild.channels.cache.get('963362129057042452');
      let accAge = `${AccountAge} ${(AccountAge == 1 ? " day" : " days")} ago`
      if(chl) {
        let rk = '';
        member.kick().catch(e => rk += e.message)
        
        chl.send({
          embeds: [
            new D.MessageEmbed()
            .setTitle('Suspicious Account')
            .setDescription(stripIndents`
            \`\`\`yaml
            User Tag: ${member.user.tag}
            User ID: ${member.user.id}
  
            Reason: 
            - Account Age is less than ${Limit} days old.
              [ Account Created ${accAge} ]

            ${(rk.length > 1) ? (`Error: ${rk}`) : ''}
            \`\`\``)
            .setColor('GREEN')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          ]
        })
      }        
    }

    
    // Stat docks
    let floof = await database.get('floof_data');
    let channelId = floof.channel_ID;       
    let channel = member.guild.channels.cache.get(channelId.toString());
    if(channel) {
      channel.setName(`🐺│Floofs: ${member.guild.memberCount}`)
        .catch(err)
    }
  
  
  }
}