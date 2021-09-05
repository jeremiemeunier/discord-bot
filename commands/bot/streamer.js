const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class ReplyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'streamer',
			memberName: 'streamer',
			group: 'divers',
			aliases: ['stream'],
			description: 'Liste les streamers configurés pour les annonces',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES']
		});
	}

	async run(msg, text) {
        var JsonUsers = fs.readFileSync('data/streamer.json');
        var dataUsers = JSON.parse(JsonUsers);
        var dataLenght = Object.keys(dataUsers).length;

        var txt = "**Les streamers que l'on suit :** (ne leur dit pas mais on les adores !) \r\n\r\n";

        for(var i = 0; i < dataLenght; i++) {
            let data = dataUsers[i];
            
            txt += `${data.twitch_name.toString()} — https://www.twitch.tv/${data.twitch_name.toString()} \r\n`;
        }

        txt += "\r\nTu veux savoir quand est-ce qu'il stream ? \r\nRend toi dans <#882582553071079490> et utilise la commande `!role list` pour t'ajouter le rôle";

        msg.say(txt);
	}
};