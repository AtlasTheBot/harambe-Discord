/*jshint esversion: 6 */
/*jshint evil: true*/
//MUAHAHAHAHA I'M EVIL

//SETUP

const Discord = require('discord.js'); //Handles the API
const Auth    = require('./auth.json'); //Auth details
const jokes   = require('./jokes.json');
const docs    = require('./docs.json');
const path    = require('path');
const fs      = require('fs');

var bot = new Discord.Client();

const inviteLink = 'https://discordapp.com/oauth2/authorize?client_id=227253877404205056&scope=bot&permissions=0';
const invoker = '🔫 ';
const version = '28.5.2016';
var messagesSeen   = 0;
var messagesServed = 0;

bot.on('ready', () => {
  bot.user.setStatus('online', `in heaven | ${invoker}help`);
  console.log('Everything is ready!');
});

//ACTUAL BOT
bot.on('message', message => { //switch is for the weak
  messagesSeen++;
  if (message.author.equals(bot.user) || message.author.bot || !message.content.startsWith(invoker)) return; //Don't reply to itself or bots
  console.log(`${message.author.username}#${message.author.discriminator} <@${message.author.id}> fell into the enclosure!\n${message.content}`);

  var cmd = message.content.replace(invoker, '').toLowerCase().split(' ');
  var messageServed = true;

  switch (cmd[0]) {
    case 'help':
      help(message); //help of course
    break;

    case 'harambe':
      harambe(message); //random pic from the 'pics' folder
    break;

    case 'gorilla':
      gorilla(message);
    break;

    case 'joke':
      joke(message);
    break;

    case 'best':
      message.channel.sendMessage('yes');
    break;

    case 'invite':
      message.channel.sendMessage(`Harambe is being transfered!\n${inviteLink}`);
    break;

    case 'eval':
      evalMsg(message);
    break;

    case 'info':
      info(message);
    break;

    case 'stats':
      stats(message);
    break;

    default:
      messageServed = false;
      //do nothing
  }
  if (messageServed) messagesServed++;
});

function help(message) {
  var cmd = message.content.replace(invoker, '').toLowerCase().split(' ');
  if (docs[cmd[1]] !== undefined) {
    message.channel.sendMessage(docs[cmd[1]]);
  } else {
    message.channel.sendMessage(
      'You read the sign on the enclosure\n```xl\nHarambe - 1999-2016\nResponded to: \n' +
      Object.keys(docs).join('\n') + `\n(Use ${invoker}help [command] for extra help)` + '\n```'
    );
  }
}

function harambe(message) {
  var fileChosen = randomFile('pics');
  message.channel.sendFile(path.join(__dirname, 'pics', fileChosen));
}

function gorilla(message) {
  if (message.member.voiceChannel === undefined) {
    message.channel.sendMessage('(You need to be in a voice channel!)');
  } else {
    var fileChosen = randomFile('sounds');
    message.member.voiceChannel.join()
      .then(connection => {
        const dispatcher = connection.playFile(path.join(__dirname, 'sounds', fileChosen));
        dispatcher.on('end', () => {
          message.member.voiceChannel.leave();
        });
      })
      .catch(console.log);
  }
}

function joke(message) {
  var cmd = message.content.replace(invoker, '').toLowerCase().split(' ');
  var chosen;

  if (cmd[1] !== undefined) {
    if (jokes[cmd[1]] !== undefined) {
      chosen = cmd[1];
    } else {
      message.channel.sendMessage('Harambe can\'t seem to find that joke...');
    }
  } else {
    chosen =  Object.keys(jokes)[Math.floor(Math.random() *  Object.keys(jokes).length)];
  }

  message.channel.sendMessage(`Joke #${chosen}\n${jokes[chosen].join('\n')}`);
}

function evalMsg(message) {
  var cmd = message.content.replace(invoker, '').split(' ');
  if (message.author.id === '74768773940256768') {
    try {
      var result = eval(cmd.splice(1).join(' '));
      message.channel.sendMessage('```js\n' + result + '\n```');
    } catch (e) {
      message.channel.sendMessage('```js\n' + e + '\n```');
    }
  } else {
    message.channel.sendMessage('Harambe was shot before he coulld respond!');
  }
}

function info(message) {
  message.channel.sendMessage(
    `Harambe v${version} by Atlas#2564\n` +
    'Source: https://github.com/AtlasTheBot/harambe-Discord\n' +
    'Official Chat: https://discord.gg/0w6AYrrMIUfO71oV\n' +
    'I regret nothing.'
  );
}

function stats(message) {
  message.channel.sendMessage(
    '```xl\n' +
    'Currently serving:' + '\n' +
    bot.guilds.size + ((bot.guilds.size !== 1 ) ? ' servers,' : ' server,') + '\n' +
    bot.users.size + ((bot.users.size !== 1 ) ? ' users,' : ' user,') + '\n' +
    bot.channels.size + ((bot.channels.size !== 1 ) ? ' channels' : ' channel') + '\n' +
    'Up for: ' + msToTime(bot.uptime) + '\n' +
    'Seen ' + messagesSeen + ((messagesSeen !== 1) ? ' messages, ' : ' message, ') + 'served ' + messagesServed + ' (' + Math.floor((messagesServed / messagesSeen) * 100) + '%)' +
    '\n```'
  );
}

//Helper funcs

function randomFile(folder) { //random file from the specified directory
  var fileNames = fs.readdirSync(path.join(__dirname, folder));
  var fileChosen = fileNames[Math.floor(Math.random() * fileNames.length)]; //Randomly choose one
  return fileChosen;
}

function msToTime(duration) {
  var seconds    = parseInt((duration/1000)%60),
      minutes    = parseInt((duration/(1000*60))%60),
      hours      = parseInt((duration/(1000*60*60))%24),
      days       = parseInt((duration/(1000*60*60*24)));

  var timeString = ((days    >= 1) ? ((days    > 1) ? days    + ' Days '   : days    + ' Day ')    : '') +
                   ((hours   >= 1) ? ((hours   > 1) ? hours   + ' Hours '  : hours   + ' Hour ')   : '') +
                   ((minutes >= 1) ? ((minutes > 1) ? minutes + ' Minutes ': minutes + ' Minute ') : '') +
                   ((seconds >= 1) ? ((seconds > 1) ? seconds + ' Seconds' : seconds + ' Second')  : '');

  return timeString;
}

//AUTH STUFF

if (Auth.discord.token !== '') {
  console.log('Logged in with token!');
  bot.login(Auth.discord.token);
} else if (Auth.discord.email !== '' && Auth.discord.password !== '') {
  console.log('Logged in with email + pass!');
  bot.login(Auth.discord.email, Auth.discord.password);
} else {
  console.log('No authentication details found!');
  process.exit(1);
}
