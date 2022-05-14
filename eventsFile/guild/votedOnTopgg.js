let { WebhookClient } = require('discord.js');
// const webhook = new WebhookClient({ url: process.env.noPingWebhook.toString() });

module.exports = {
  name: 'votedOnTopgg',
  listener: 'guildMemberUpdate',
  async run(client, before, after) {
    // print(before,'\n\n============\n\n',after)

    let roleId = '963362065932750869';
    let botTopGG = '422087909634736160';
    
    let before_roles = before._roles;
    let after_roles = after._roles;
    let guild = (!before) ? after.guild : before.guild;
    
    const Logs = await guild.fetchAuditLogs({
      limit: 1,
      // user: '422087909634736160', // Top.gg Bot
      type: 25, // Update member role
    });

    let Clean = Logs.entries.toJSON()[0];

    let executor = Clean.executor;   
    // print(executor.id,botTopGG,executor.id == botTopGG)
    if(executor.id == botTopGG) 
    {
      if(Clean.reason.toLowerCase().includes('vote expired')) 
      {
        let channel = await client.channels.fetch('964285296420216873');
        
        if(channel) 
        {    
          channel.send({
            content: `**${before.user.toString()}**, now you can vote again on Top.gg.\n[ <https://top.gg/servers/961666391633698856/vote> ]`
          }).catch(err)            
        }          
      }
      else if(Clean.reason.toLowerCase().includes('voted on')) 
      {
        let channel = await client.channels.fetch('964285296420216873');
        
        if(channel) 
        {    
          channel.send({
            content: `Thanks for voting our server, **${before.user.tag}**.`
          }).catch(err)            
        }          
      }
    }
    //
  }
}