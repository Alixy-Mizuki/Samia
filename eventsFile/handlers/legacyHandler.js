let Discord = require('discord.js');
let cooldowns = new Discord.Collection();
const { stripIndents, oneLine } = require('common-tags');

module.exports = {
  name: 'legacyHandler',
  listener: 'messageCreate',
  async run(client, message) {
  
  	if ((message.author.bot) ||/* (message.channel.type === 'DM') ||*/ (message.type === 'THREAD_CREATED') ) return;
  
    let prefix = await database.get('prefix')
  
    prefix = prefix ?? 's.';

    client.prefix = prefix;
    
  	function PREFIX(pr) {
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let EE = []
      for(let Pref of pr) {
        EE.push( escapeRegex(Pref) )
      }
      return EE
    }
    
    // prefix is an array
    prefix = (Array.isArray(prefix)) ? 
      (prefix.push(`<@!?${client.user.id}> `)) : (Array(prefix, `<@!?${client.user.id}> `));

    
    let matchedPrefix = prefix.find(p => message.content.startsWith(p))
    if(!matchedPrefix) return;
    
  	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  	const commandName = args.shift().toLowerCase();

    // print(commandName)

    const Teams = client.owner;
  
//━━━━━━━━━━━━━━ [ Defining command and aliases ] ━━━━━━━━━━━━━━━
  	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  
  	if (!command) return;
  
//━━━━━━━━━━━━━━ [ guildOnly ] ━━━━━━━━━━━━━━━
  	if (command.guildOnly && message.channel.type === 'DM') {
  		return message.channel.send( { content: 'I can\'t execute that command inside DMs!'} );
  	}
  
//━━━━━━━━━━━━━━ [ devsOnly ] ━━━━━━━━━━━━━━━
  	if (command.devsOnly && !Teams.includes(message.author.id)) return false;
    
//━━━━━━━━━━━━━━ [ User permissions ] ━━━━━━━━━━━━━━━
    if (command.userPermissions && command.userPermissions.length > 0 && !Teams.includes(message.author.id) ) {
      if(Array.isArray(command.userPermissions)) {
        let missingPerms = [];
        for(let perm of command.userPermissions) {
          
          if( Boolean(message.member.permissions.has( perm.toUpperCase() )) == false) {
            missingPerms.push(permissions[perm]);
          }
          // continue;
        }

        let PH = oneLine`
          You need the following permissions for the \`${command.name}\` command to work:
          \`${missingPerms.join('\`, \`')}\`
        `

        if(missingPerms.length > 0) {
          return message.channel.send({ content: PH });
        }
      }
    }

//━━━━━━━━━━━━━━ [ Client permissions ] ━━━━━━━━━━━━━━━
    if (command.clientPermissions && command.clientPermissions.length > 0) {
      if(Array.isArray(command.clientPermissions)) {
        let missingPerms = [];
        for(let perm of command.clientPermissions) {
          if( Boolean( message.guild.me.permissions.has(perm.toUpperCase()) ) == false) {
            missingPerms.push(permissions[perm]);
          }
          // continue;
        }

        let PH = oneLine`
          I need the following permissions for the \`${command.name}\` command to work:
          \`${missingPerms.join('\`, \`')}\`
        `
        if(missingPerms.length > 0) {
          return message.channel.send({ content: PH });
        }
      }
    }

//━━━━━━━━━━━━━━ [ args length ] ━━━━━━━━━━━━━━━
    if(command.argsRequired && !args.length) {
      if(command.usage && command.usage.length >= 1) {
        let Arguments = '';
        let pr = (Array.isArray(prefix)) ? prefix[0] : prefix;
        let Use = `${pr}${command.name}`

        Arguments += `Missing Arguments\nCommand Usage:\n${Use} ${command.usage.join(`\n${Use} `)}\n`

        if(command.aliases.length >= 1) {
          let allAlias = '';
          for(let alias of command.aliases) {
            let Alias = `${pr}${alias}`

            allAlias += `${Alias} ${command.usage[0]}\n`;

          }
          Arguments += `\nUsing Aliases:\n${allAlias}`;
        }

        Arguments += `\n<> = Required | [] = Optional`

        return message.reply(stripIndents`\`\`\`yaml
        ${Arguments}
        \`\`\``);
      }
      if(!command.usage || command.usage.length < 1) {
        return message.reply('Please provide an arguments')
      }
    }

//━━━━━━━━━━━━━━ [ cooldown ] ━━━━━━━━━━━━━━━
  	if (!cooldowns.has(command.name)) {
  		cooldowns.set(command.name, new Discord.Collection());
  	}
  
  	const now = Date.now();
  	const timestamps = cooldowns.get(command.name);
  	const cooldownAmount = (command.cooldown || 5) * 1000;
  
  	if(!Teams.includes(message.author.id))
  	{
      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply( { content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`} );
        }
      }
    
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  	}

//━━━━━━━━━━━━━━ [ try the command ] ━━━━━━━━━━━━━━━
  	try {
      console.log(`${message.author.tag} [ Legacy: ${command.name} ]`  )
      command.run(client, message, args )
		} 
    catch (error) {
  		console.error(error);
  		message.reply( { content: 'There was an error trying to execute that command!' } );
  	}


//
	}
}