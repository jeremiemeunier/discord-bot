const CommandoClient = require('./client');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env'))
for (const k in envConfig) {
    process.env[k] = envConfig[k]
}

const client = new CommandoClient({
    commandPrefix: '!',
    owner: process.env.BOT_OWNER_ID,
    disableMentions: 'everyone',
    presence: {
      activity: {
        name: '!help',
        type: 'PLAYING'
      }
    }
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['divers', 'Divers'],
        ['admin', 'Admin'],
        ['bot', 'Bot'],
        ['events', 'Events'],
        ['support', 'Support'],
        ['audio', 'Audio'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'))
;

client.login(process.env.BOT_TOKEN);