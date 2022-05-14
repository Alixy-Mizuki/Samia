let Find = require('./util/util');

module.exports = {

  name: "guildMemberUpdate",

  async handle(client, before, after)
  {
       
      let events = client.events;
  
      let allEvents = await Find(events, 'guildMemberUpdate')  
      allEvents.forEach(event => {
        // print(event)
        event.run(client, before, after)
      })
  }
}
