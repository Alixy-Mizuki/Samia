let Find = require('./util/util');

module.exports = {

  name: "inviteCreate",

  async handle(client, invite)
  {
    
      console.log(`${client.user.username} is alive`);
    
      let events = client.events;
  
      let allEvents = await Find(events, 'inviteCreate')  
      allEvents.forEach(event => {
        // print(event)
        event.run(client, invite)
      })
  }
}
