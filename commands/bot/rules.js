const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class ReplyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rules',
			memberName: 'rules',
			group: 'bot',
			aliases: ['regles'],
			description: 'Renvoie vers le channel des règles',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES']
		});
	}

	async run(msg, text) {
        var txt = "comme un rappel ne fait pas de mal : <#882582553071079485>";
        msg.reply(txt);
	}
};