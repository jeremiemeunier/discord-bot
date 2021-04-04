const { Command } = require('discord.js-commando');

module.exports = class PlayAudioCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			memberName: 'play',
			group: 'audio',
			description: 'Connect bot to your audio channel and playing music or adding at the ',
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