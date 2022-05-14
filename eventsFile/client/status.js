module.exports = {
  name: 'status',
  listener: 'ready',
  async run(client) {
    client.user.setActivity('Me Must Bonk You, If You Is Naughty')
    
  }  
}