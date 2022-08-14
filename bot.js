const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let booty_settings = JSON.parse(fs.readFileSync('data/discord_bot.json'));
let secret_settings = JSON.parse(fs.readFileSync('data/secret.json'));

const { Client, GatewayIntentBits, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });



function logger(txt, timed = true) {
	let logs_tag = `\x1b[32mdiscord_bot[${booty_settings.version}]`;

	if(timed == true) {
		logs_tag += ` ${dateReturn()} \x1b[0m `;
	} else { logs_tag += `\x1b[0m `; }

	console.log(`${logs_tag}${txt}`);
	let ajd = new Date();

	if(ajd.getDate() < 10) { ajdDate = `0${ajd.getDate()}`; } else { ajdDate = ajd.getDate(); }
	if(Number(ajd.getMonth() + 1) < 10) { ajdMonth = `0${Number(ajd.getMonth())+1}`; } else { ajdMonth = Number(ajd.getMonth())+1; }

	let ajd_compose = `${ajdMonth}-${ajdDate}-${ajd.getFullYear()}`;
	fs.writeFile(`logs/discord_bot-${ajd_compose}.log`, `${logs_tag}${txt}\r\n`, { flag: 'a' }, err => {
		if(err) {
			console.log(err);
			return;
		}
	});
}

function dateReturn(ajd) {
	let ret = '';

	if(ajd == undefined) { ajd = new Date(); }

	if(ajd.getHours() < 10) { ret += `0${ajd.getHours()}:`; } else { ret += `${ajd.getHours()}:`; }
	if(ajd.getMinutes() < 10) { ret += `0${ajd.getMinutes()}:`; } else { ret += `${ajd.getMinutes()}:`; }
	if(ajd.getSeconds() < 10) { ret += `0${ajd.getSeconds()}`; } else { ret += `${ajd.getSeconds()}`; }

	if(ajd.getMilliseconds() < 10 && ajd.getMilliseconds() < 100) { ret += `.00${ajd.getMilliseconds()}`; }
	else if(ajd.getMilliseconds() > 10 && ajd.getMilliseconds() < 100) { ret += `.0${ajd.getMilliseconds()}`; }
	else { ret += `.${ajd.getMilliseconds()}`; }

	return ret;
}

function boot() {
	logger(`as \x1b[34m${client.user.tag}\x1b[0m`, false);
	if(booty_settings.waiting == true) {
		logger(`countdown : \x1b[34m${booty_settings.countdown}ms\x1b[0m`, false);
		logger(`as now starting countdown`, false);
	}
	else { logger(`is to exited to wait`, false); }

	let server = client.guilds.cache.get(secret_settings.GUILD_ID);
	let announce = client.channels.cache.find(channel => channel.name === booty_settings.channel.announce)
	let debug = client.channels.cache.find(channel => channel.name === booty_settings.channel.debug)
	let every = server.roles.cache.find(role => role.name === '@everyone');

	if(booty_settings.debug == true) {
		logger(`\x1b[43m\x1b[30m START VAR SETTINGS \x1b[0m `, false);
		logger(`as set channel \x1b[34m${booty_settings.channel.announce}\x1b[0m to \x1b[34m${announce.id}\x1b[0m`, false);
		logger(`as set channel \x1b[34m${booty_settings.channel.debug}\x1b[0m to \x1b[34m${debug.id}\x1b[0m`, false);
		logger(`as set everyone to \x1b[34m${every.id}\x1b[0m`, false);
		logger(`\x1b[43m\x1b[30m END VAR SETTINGS \x1b[0m `, false);
	}

	logger(`send a message in \x1b[34m${booty_settings.channel.debug}\x1b[0m`, false);
	const bootEmbed = new MessageEmbed()
		.setColor('#5865f2')
		.setTitle('discord_bot as initialized')
		.setDescription('discord_bot as full operate at ' + dateReturn(new Date()))
		.addFields(
			{ name: 'Debug', value: booty_settings.debug.toString() },
			{ name: 'Announce channel', value: announce.toString() },
			{ name: 'Announce role', value: '<@&' + booty_settings.role.announce.toString() + '>' }
		)
		.setTimestamp()
		.setFooter({ text: '— discord_bot ' + booty_settings.version.toString() });
		
	debug.send({ embeds: [bootEmbed] });

	logger(`is initialized at \x1b[34m${dateReturn(new Date())}\x1b[0m`, false);
	logger(`\x1b[42m\x1b[30m discord_bot [${booty_settings.version}] INITIALIZED \x1b[0m `, false);
}

client.on('messageCreate', msg=> {
  if(msg.author.bot) return
  else {
    if(msg.content.startsWith("!")) {
      // switch commands
      args = msg.content.split(" ");
      if(args[0] === '!role') {
        var JsonRole = fs.readFileSync('data/roles/generics.json');
        var JsonRoleNotifs = fs.readFileSync('data/roles/notifs.json');
        var dataRole = JSON.parse(JsonRole);
        var dataRoleNotifs = JSON.parse(JsonRoleNotifs);
        var dataLenght = Object.keys(dataRole).length;
        var dataLenghtNotifs = Object.keys(dataRoleNotifs).length;

		const pastilleEmojie = msg.guild.emojis.cache.find(emoji => emoji.name === 'bichon_pastille');

		// msg.react(pastilleEmojie);

        if(args[1] != '' || args[1] == null) {
          if(args[1] === 'list') {
            let txt = "Voici la liste des rôles disponibles :```";
            for(var i = 0; i < dataLenght; i++) {
              let data = dataRole[i];
              txt += `${i} — ${data.role_name.toString()} (${data.role_desc.toString()})\r\n`;
            }
            
            txt += "``` Pour t'ajouter un rôle utilise la commande `!role add 1` et pour le retirer `!role remove 1`";
            msg.reply({ content:txt, fetchReply:true });
          }
          else if(args[1] === 'remove') {
            if(args[2] <= dataLenght) {
              let role = msg.guild.roles.cache.find(role => role.name === dataRole[args[2]].role_name);
              let author = msg.member;
              author.roles.remove(role);
              msg.reply({ content:`Je t'ai bien retirer le rôle **${dataRole[args[2]].role_name}** !`, fetchReplay:true});
            } else { msg.reply("Ce rôle n'est pas disponible essais avec ceux de la liste : `!role list`"); }
          }
          else if(args[1] === 'add') {
            if(args[2] <= dataLenght) {
              let role = msg.guild.roles.cache.find(role => role.name === dataRole[args[2]].role_name);
              let author = msg.member;
              author.roles.add(role);
              msg.reply(`Je t'ai bien ajouter le rôle **${dataRole[args[2]].role_name}** profites en bien !`);
            } else { msg.reply("Ce rôle n'est pas disponible essais avec ceux de la liste : `!role list`"); }
          }
		  else if(args[1] === 'notifs') {
			let txt = "Voici la liste des rôles disponibles :```";
            for(var i = 0; i < dataLenghtNotifs; i++) {
              let data = dataRoleNotifs[i];
              txt += `${i} — ${data.role_name.toString()} (${data.role_desc.toString()})\r\n`;
            }
		  }
        }
        else { msg.reply('Tu dois indiquer un nom de rôle par exemple : `!role add 1` pour les connaîtres : `!role list` ou `!role notifs` selon les notifications que tu souhaite recevoir. Si tu veux te retirer un rôle fait `!role remove 1`'); }
      }
      else {
        // nouvelle commande
      }
    }
  }
})

client.on('ready', () => { /*boot();*/ });
client.login(secret_settings.BOT_TOKEN);