let DC = require('discord.js');
let client = new DC.Client({ intents: 32767 })
const { readdir, readdirSync } = require('fs');
const { Database } = require("quick.replit");
const database = new Database(process.env.REPLIT_DB_URL)

client.login(process.env.token)
client.slashCommands = new DC.Collection();
client.commands = new DC.Collection();
client.events = new DC.Collection();
client.owner = [
  '692632336961110087'
]

global.database = database;
global.cmds = client.slashCommands;
global.print = console.log;
global.err = (e) => { console.log(e) }
global.wait = (ms) => {
  if (!ms) throw new TypeError("Time isn't specified");
  return new Promise((resolve) => setTimeout(resolve, ms));
};

process.on('unhandledRejection', (r,pr) => print(r))
process.on('uncaughtException', (e,o) => print(e))
process.on('multipleResolves', (e,o) => print(e))


// CUSTOM EVENT REGISTRAR
const CEFolder = readdirSync(process.cwd()+'/eventsFile');
for (const subfolder of CEFolder) 
{
  const eventFiles = readdirSync(`${process.cwd()}/eventsFile/${subfolder}`)
    .filter(file => file.endsWith('.js'));
      
  for (const file of eventFiles) 
  {
    const event = require(`${process.cwd()}/eventsFile/${subfolder}/${file}`);
    if(!event || !event.listener ) {
      continue;
    }
    client.events.set(event.name, event)
    // print(event)
  }
}


// EVENT LOADER
readdir(`${process.cwd()}/events/`, (err, files) => 
  {
  
  if (err) return console.error(err);
  
  files.forEach(file => 
  {
  
    if(!file.endsWith('.js')) return;
    const event = require(`${process.cwd()}/events/${file}`);

    
    let eventName = file.split(".")[0];
    client.on(event.name, event.handle.bind(null, client))
    print(event)
  });
});
