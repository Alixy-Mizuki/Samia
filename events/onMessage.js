let Find = require('./util/util');

module.exports = {

  name: "messageCreate",

  async handle(client, message)
  {
      let events = client.events;
  
      let allEvents = await Find(events, "messageCreate")
  
      allEvents.forEach(event => {
        // print(event)
        event.run(client, message)
      })
  }
}