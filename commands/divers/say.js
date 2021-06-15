const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'announce',
			memberName: 'announce',
			group: 'divers',
			aliases: ['say'],
			description: 'Annonce quelque chose.',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['ADMINISTRATOR']
		});
	}

	async run(msg, text) {
		if(text != undefined && text != '') {
			msg.say(`**Annonce** : <@&853051693193625620> ${text}`);
		}
		else { msg.say('Je ne peut rien annoncer tu ne m\'a pas donnée d\'information'); }
	}
};