const { stripIndents, oneLine } = require('common-tags');
const { disambiguation } = require('discord.js-commando/src/util');
const { Command } = require('discord.js-commando');
const Discord = require('discord.js')

module.exports = class HelpCommand extends Command {
    constructor(client) {
		super(client, {
			name: 'wholive',
			memberName: 'wholive',
			group: 'divers',
			aliases: ['live'],
			description: 'Liste les membres en live.',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES'],
	        guildOnly: true,
	        throttling: {
	            usages: 2,
	            duration: 10,
	        },
		});
    }

    async run(msg, args) {
        const commands = this.client.registry.findCommands(args.command, false, msg);

        const embed = new Discord.MessageEmbed()
            .setColor('#5865f2');

        embed
            .setTitle(`Les streamers de qualité du serveur actuellement en live`);

        return msg.say(embed)
    }
};