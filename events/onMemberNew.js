let Find = require('./util/util');

module.exports = {

  name: "guildMemberAdd",

  async handle(client, member)
  {
       
      let events = client.events;
  
      let allEvents = await Find(events, 'guildMemberAdd')  
      allEvents.forEach(event => {
        // print(event)
        event.run(client, member)
      })
  }
}
