let {readdirSync} = require('fs');
let Guilds = [
  '961666391633698856' // FurBox
]

module.exports = {
  name: 'commandsLoader',
  listener: 'ready',
  async run(client, int) {
  
    let commands = [];
  
    const slashyFolders = readdirSync(process.cwd()+'/commands');
  
    for (const folder of slashyFolders) 
    {
      const commandFiles = readdirSync(`${process.cwd()}/commands/${folder}`)
        .filter(file => file.endsWith('.js'));
      
      const FILES = readdirSync(`${process.cwd()}/commands/${folder}`);
        
      for (const file of commandFiles) 
      {
        const command = require(`${process.cwd()}/commands/${folder}/${file}`);
        // console.log(command)
        if(!command || !command.data ) {
          continue;
        }
        client.slashCommands.set(command.data.name, command)
        commands.push(command.data)
        // console.log(command.name)
      }
    }
    
    Guilds.forEach(g => {
      client.application.commands.set(commands, g)
    })
  
    console.log(`[BOT] SLASH LOADED`)
  
  }
}