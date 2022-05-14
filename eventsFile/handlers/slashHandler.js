module.exports = {
  name: 'slashHandler',
  listener: 'interactionCreate',
  async run(client, int) {

    if (!int.isCommand()) return;
  
    const command = client.slashCommands.get(int.commandName);
  
    if (!command) return;
  
    try 
    {
      await command.run(client, int);
      console.log(int.user.tag+" [ Slash: "+command.data.name+` ]`  )
    } 
    catch (error) 
    {
      console.error(error);
      await int.reply({ 
        content: 'There was an error while executing this command!', ephemeral: true 
      });
    }
  }
}