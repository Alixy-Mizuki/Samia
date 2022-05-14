let Find = require('./util/util');

module.exports = {

  name: "interactionCreate",

  async handle(client, int)
  {
      let events = client.events;
  
      let allEvents = await Find(events, "interactionCreate")
  
      allEvents.forEach(event => {
        // print(event)
        event.run(client,int)
      })
  }
}