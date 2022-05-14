let Find = require('./util/util');

module.exports = {

  name: "guildMemberRemove",

  async handle(client, member)
  {
       
      let events = client.events;
  
      let allEvents = await Find(events, 'guildMemberRemove')  
      allEvents.forEach(event => {
        // print(event)
        event.run(client, member)
      })
  }
}
