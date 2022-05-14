module.exports = {
  name: 'bump',
  listener: 'messageCreate',
  async run(client, message) {

    if(message.author == '302050872383242240') {
      let embeds = message.embeds.map(a =>a);
      if(!embeds) return;
      
      let desc = embeds[0].description;
      let messageAdds = await database.get('bump_message');
  
      let messageAddons = (!messageAdds) ? 
        '': 
        (!messageAdds.length) ? 
        '': 
        `\n\n**Additional Message:** ${messageAdds}`;
      
  
      if(desc.toLowerCase().includes('bump done')) {
        let user = message.interaction.user;
        
        await message.channel.send(`${user}, I will ping you on the next bump.${messageAddons}`)
        
        setTimeout(function() {
          message.channel.send(`${user}, You can Bump again now.`)
          print('Informed')
        }, 7320000) // 122 minutes
        
      }
      
      return;
    }

    
  }  
}