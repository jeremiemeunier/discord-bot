const { Command } = require('discord.js-commando');
const Discord = require('discord.js')

module.exports = class SupportTicket extends Command {
	constructor(client) {
		super(client, {
			name: 'create',
            group: 'support',
			memberName: 'create',
			description: 'Crée un ticket de support',
            clientPermissions: ['SEND_MESSAGES'],
	        guildOnly: true,
	        throttling: {
	                usages: 2,
	                duration: 10,
	        },
		});
	}

	async run(msg) {
            msg.say(`Bonjour, je suis ${this.client.user.tag} ! Wouf wouf !`);
	}
};