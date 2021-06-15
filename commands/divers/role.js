const { stripIndents, oneLine } = require('common-tags');
const { disambiguation } = require('discord.js-commando/src/util');
const { Command } = require('discord.js-commando');
const Discord = require('discord.js')

module.exports = class HelpCommand extends Command {
    constructor(client) {
		super(client, {
			name: 'role',
			memberName: 'role',
			group: 'divers',
			aliases: ['addrole'],
			description: 'Ajoute le rôle indiqué en paramètres',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES'],
	        guildOnly: true,
		});
    }

    async run(msg, args) {
        let role = msg.guild.roles.cache.find(role => role.name === args);

        if(args != '') {
            if(args === 'list') {
                msg.say('Voici la liste des rôles disponibles :```Amateurs de frisbee\r\nMinecraft\r\nnotifs\r\nChiens de l\'internet```');
            }
            else if(role != undefined) {
                let author = msg.member;
                author.roles.add(role);
                msg.reply(`le rôle t'a été ajouté`);
            }
            else { msg.say('Le rôle n\'existe pas `(!role list)`'); }
        }
        else { msg.say('```Vous devez indiquer un nom de rôle par exemple : !role notifs pour les connaître : !role list```'); }
    }
};