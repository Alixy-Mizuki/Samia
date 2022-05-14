let { MessageEmbed } = require('discord.js');
let axios = require('axios');
let p = console.log;

module.exports = {
  name: 'wordGame',
  listener: 'messageCreate',
  async run(client, message) { 
    try
    {
      if(message.guild.id == '961666391633698856') 
      {
        
        let channel = '964748067691696168';
        let api = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        let word = message.content.toLowerCase();
        let Database = database;
  
        let removeDup = (array) => { return Array.from(new Set(array).values()); };
        let del = (m) => { setTimeout(() => m.delete(), 5000) };
        let err = (e) => { return p(e) };
  
        function arrChoose(array) 
        {
          if (!array) throw new TypeError('A array was not specified.');
          if (typeof array !== 'object') 
          {
                  throw new TypeError('The provided array is invalid.');
          }
          const res = Math.floor(Math.random() * array.length);
          return array[res];
        }
        
        
        let Found = '🎉'; // [Found]
        let Saved = '📁'; //  [Saved]
        let NotFound = '❓'; // [Not Found]
        let WrongLetter = '❌'; // [wrong letter]
  
        if(message.channel.id == channel && !message.author.bot) 
        {
          let SavedWord = await Database.get('wordGame-savedWord');
          let CurrWord = await Database.get('wordGame-currWord');
          let User = await Database.get('wordGame-user');
  
          // if(!SavedWord) SavedWord = ['start'];
          // if(!CurrWord) CurrWord = '';
          // if(!User) User = '';
  
          if(word.length < 2) return;
          
          if(word == '!!reroll') {
            // p(0)
            if(CurrWord && User) {
              if(message.member.permissions.has('MANAGE_MESSAGES')) {
                let choosed = arrChoose(SavedWord)
                let lastword = CurrWord;
                
                await Database.set('wordGame-currWord', choosed);
                await Database.set('wordGame-user', client.user.id);
                                
                let rrr = new MessageEmbed()
                .setTitle(`I'll reroll the word for you!`)
                .setDescription(`OwO, it seems that word that start with \`${lastword}\` is hard...\n\n**NEW WORD** \`${choosed}\``)
                .setColor('RANDOM')
      
                return message.channel.send({ embeds: [rrr] }).catch(err)
              }
            }
          }
            
          
          let regx = new RegExp('^[a-zA-Z]','i')
          let regex2 = new RegExp('^(.*)[a-zA-Z]$','i')
          //if the message not start with letter do nothing
          if(!regx.test(message.content)) return;
          if(!regex2.test(message.content)) return;
  
          // Check if the savedword json available, if not create one
          if(!SavedWord || !CurrWord || !User) {
            await Database.set('wordGame-savedWord', [])
            await Database.set('wordGame-currWord', '')
            await Database.set('wordGame-user', '')
            
            SavedWord = await Database.get('wordGame-savedWord')
          }
  
          // Only Run if Current Word Exist
          if(CurrWord) {
            let lastLetter = CurrWord[ CurrWord.length-1 ]
            // p(1)
            if(word == 'cw') {
              let CW = new MessageEmbed()
              .setTitle('Current Word')
              .setDescription(`\`Word:\` **${CurrWord}**\n\`By:\` **<@!${User}>**`)
              .setColor('RANDOM')
    
              return message.channel.send({ embeds: [CW] }).catch(err)
            }
            // P(2)
        /*
              //check if the user are the same
            else if(message.author.id == User) {
              let sameUser = new MessageEmbed()
              .setTitle('Give others a chance too')
              .setDescription('Easy Boi, whose is the gud boy. OwO')
              .setColor('RED')
    
              return message.reply({ embeds: [sameUser] }).then(del).catch(err)
              
            }
        */
            // p(3)
            // Check if the word that being input is the last chars in the saved word
            else if(!word.startsWith(lastLetter)) {
              return message.react(WrongLetter)
            }
            // p(4)
          }
            
          let res = await axios.get( api+word ).then(res => res).catch(err => err.response)
        
          if(res.status == 200) {
  
            let words = res && res.data && res.data.map(b=>b.word)
            let noDupWord = removeDup(words)
            
            // p(word,noDupWord,SavedWord.includes(noDupWord))
  
            // p(SavedWord)
            // check if the word is listed, if it does just react
            if(SavedWord.some(e => e == noDupWord[0])) {
              return message.react(Saved).catch(err)
            }
              
            // check if the word is listed, if its not add it
            if(!SavedWord.some(e => e == noDupWord[0])) {
              await Database.push('wordGame-savedWord', noDupWord[0])
              await Database.set('wordGame-currWord', noDupWord[0])
              await Database.set('wordGame-user', message.author.id)
  
              let regWords = await Database.get('wordGame-savedWord')
  
              let found = new MessageEmbed()
                .setTitle(`${message.member.displayName} SUCCESS!`)
                .setDescription(`**NEW WORD:** \`${noDupWord[0]}\`\n\nTotal word registered: **${regWords.length}** `)
                .setColor('RANDOM')
              
              message.react(Found)
                .then(() =>  message.channel.send({ embeds: [found] }).catch(err))
                .catch(err)
  
              return;
            } 
            
          }
          else if(res.status == 404) {
            message.react(NotFound)
          }
        
        }
      }
    }
    catch(e) 
    {
      err(e);
    }  
  }  
}