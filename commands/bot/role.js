const { stripIndents, oneLine } = require('common-tags');
const { disambiguation } = require('discord.js-commando/src/util');
const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = class HelpCommand extends Command {
    constructor(client) {
		super(client, {
			name: 'role',
			memberName: 'role',
			group: 'bot',
			aliases: ['addrole'],
			description: 'Ajoute le rôle indiqué en paramètres',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES'],
	        guildOnly: true,
		});
    }

    async run(msg, args) {
        var JsonRole = fs.readFileSync('data/roles.json');
        var dataRole = JSON.parse(JsonRole);
        var dataLenght = Object.keys(dataRole).length;

        if(args != '') {
            if(args === 'list') {
                let txt = "Voici la liste des rôles disponibles :```";
                for(var i = 0; i < dataLenght; i++) {
                    let data = dataRole[i];

                    txt += `${i} — ${data.role_name.toString()} (${data.role_desc.toString()})\r\n`;
                }

                txt += "``` Pour t'ajouter un rôle utilise la commande `!role 1`";
                msg.say(txt);
            }
            else {
                if(args <= dataLenght) {
                    let role = msg.guild.roles.cache.find(role => role.name === dataRole[args].role_name);
                    let author = msg.member;
                    author.roles.add(role);
                    msg.reply(`je t'ai bien ajouter le rôle **${dataRole[args].role_name}** profites en bien !`);
                } else { msg.reply("Ce rôle n'est pas disponible essais avec ceux de la liste : `!role list`"); }
            }
        }
        else { msg.reply('tu dois indiquer un nom de rôle par exemple : `!role 1` pour les connaîtres : `!role list`'); }
    }
};