

module.exports = {
  name: 'leftMember',
  listener: 'guildMemberRemove',
  async run(client, member) {
    let floof = await database.get('floof_data');

    let channelId = floof.channel_ID;    
    
    let channel = member.guild.channels.cache.get(channelId.toString());

    if(channel) {
      channel.setName(`🐺│Floofs: ${member.guild.memberCount}`)
        .catch(err)
    }
  
  
  }
}