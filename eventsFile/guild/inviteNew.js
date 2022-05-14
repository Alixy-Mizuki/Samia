const D = require('discord.js')
const { stripIndents, oneLine } = require('common-tags');

module.exports = {
  name: 'inviteNew',
  listener: 'inviteCreate',
  async run(client, invite) {
    try {
      let chan = await client.channels.fetch('969984534571515914');
      if(chan) {
        let { code, inviter, temporary, expiresTimestamp } = invite;

        let fl = (name,value) => { return {name,value} };

        let embed = new D.MessageEmbed()
        .setTitle('New Invite Link Created For this Server')
        .addFields(
          fl('Inviter', oneLine`${inviter} | \`${inviter.tag}\` | \`${inviter.id}\``),
          fl('Invite Code', `\`${code ?? 'N/A'}\``),
          fl('Expires at?', oneLine`
            ${ (isNaN(expiresTimestamp)) ? (`<t:${parseInt(expiresTimestamp/1000)}:R>`) : '\`N/A\`' } 
          `)
        )
        .setColor('YELLOW')
        .setFooter({ text: `use /invitemanager delete to delete`, iconURL: (invite.guild.iconURL({ format: 
          'png'}) ?? '') });

        chan.send({ embeds: [embed] }).catch(err)
      }
      console.log(invite)
    }
    catch(e) {
      print(e)
    }

  }
}