let Find = require('./util/util');

module.exports = {

  name: "ready",

  async handle(client)
  {
    
      console.log(`${client.user.username} is alive`);
    
      let events = client.events;
  
      let allEvents = await Find(events, 'ready')  
      allEvents.forEach(event => {
        // print(event)
        event.run(client)
      })
  }
}
