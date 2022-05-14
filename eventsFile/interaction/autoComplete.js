module.exports = {
  name: 'autoComplete',
  listener: 'interactionCreate',
  async run(client, int) {
      
    if(int.isAutocomplete()) 
    {
      console.log(int.options._hoistedOptions)
      let createAC = (name,value) => { return { name, value} };
      
      let CommandOptions = int.options._hoistedOptions;
      if(!CommandOptions) return;
  
      let filter = (target) => { return CommandOptions.find(c => c.name == target) };
      
      if(filter('r_cmd')) 
      {
        let data = filter('r_cmd');
        let createAC = (name,value) => { return { name, value} };
        let commandsName = cmds.map(c => c.data.name);
        let ACL = [];
        
        commandsName.forEach(x => {
          if(x.includes(data.value)) {
            ACL.push( createAC(x, x) )
          }
        })
        return int.respond(ACL)
      }
      if(filter('r_event')) 
      {
        let data = filter('r_event');
        let createAC = (name,value) => { return { name, value} };
        let Events = client.events.map(c => c.name);
        let ACL = [];
        
        Events.forEach(x => {
          if(x.includes(data.value)) {
            ACL.push( createAC(x, x) )
          }
        })
        return int.respond(ACL)
      }
      if(filter('db_s_target')) {
        let data = filter('db_s_target');
        let createAC = (name,value) => { return { name, value} };
        let Datas = await database.all().then(a => a.map(c => c.ID));
        let ACL = [];
        
        Datas.forEach(x => {
          if(x.includes(data.value)) {
            ACL.push( createAC(x, x) )
          }
        })
        return int.respond(ACL)
      }
      if(filter('db_u_target')) {
        let data = filter('db_u_target');
        let createAC = (name,value) => { return { name, value} };
        let Datas = await database.all().then(a => a.map(c => c.ID));
        let ACL = [];
        
        Datas.forEach(x => {
          if(x.includes(data.value)) {
            ACL.push( createAC(x, x) )
          }
        })
        return int.respond(ACL)        
      }
      if(filter('db_p_target')) {
        let data = filter('db_p_target');
        let createAC = (name,value) => { return { name, value} };

        let arrays = await database.all()
          .then(a => a.filter(d => Array.isArray(d.data))); 

        let Datas = arrays.map(e => e.ID);      
        
        let ACL = [];
        
        Datas.forEach(x => {
          if(x.includes(data.value)) {
            ACL.push( createAC(x, x) )
          }
        })
        return int.respond(ACL)        
      }
      if(filter('im_code')) {
        let data = filter('im_code');

        let r = (user, code, uses) => { return { user, code, uses } };

        let invites = await int.guild.invites.fetch()
        let Datas = invites.map(e => r(e.inviter, e.code, e.uses) );
        
        let ACL = [];
        
        Datas.forEach(x => {
          // print(x, createAC(`${x.code} [ ${x.user.tag} | ${x.uses} uses ]`, x.code))
          
          if(x.code.includes(data.value)) {
            ACL.push( 
              createAC(`${x.code} [ ${x.user.tag} | ${x.uses} uses ]`, x.code)
            )
          }
        })
        return int.respond(ACL)
      }


      ///
    }
    
  }  
}