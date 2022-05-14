let Find = require('./util/util');

module.exports = {

  name: "os",

  async handle(client)
  {
    let events = client.events;

    let allEvents = await Find(events, 'os')  
    allEvents.forEach(event => {
      // print(event)
      event.run()
    })
  }
}
