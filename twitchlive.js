const Discord = require('discord.js')
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const debug = false; // set as TRUE for console.log most important states // default : false
const wait = true; // set as FALSE to shutdown the interval // default : true

const envConfig = dotenv.parse(fs.readFileSync('./.env'))
for (const k in envConfig) {
    process.env[k] = envConfig[k]
}

if(debug == true) { console.log('\x1b[43m\x1b[30m ### DEBUG IS ENABLED ### \x1b[0m '); }
else { console.log('\x1b[43m\x1b[30m ### DEBUG IS DISABLED ### \x1b[0m '); }


var client = new Discord.Client();

function discordBotLive() {
	var dataUsers = [{"discord_id":"165806292840087552","discord_name":"DarkBichon","twitch_id":"127396424","twitch_name":"dark_bichon"},{"discord_id":"222776756870971393","discord_name":"WyZzeur","twitch_id":"39928727","twitch_name":"WyZzeur"},{"discord_id":"105263001388507136","discord_name":"Leha","twitch_id":"73474297","twitch_name":"Leha83"},{"discord_id":"223352044730318859","discord_name":"Nekzq.","twitch_id":"601540513","twitch_name":"nekzq"}];
	var dataLenght = dataUsers.length;

	for(var i = 0; i < dataLenght; i++) {
		let data = dataUsers[i];
		isonliveid(data);
	}
}
function xhrCheck(xhr) {
	if(debug == true) { console.log('\x1b[43m\x1b[30m ### DEBUG : CHECK [(STATE : '+ xhr.readyState +')(STATUS : '+ xhr.status +')] ### \x1b[0m '); }
	if(xhr.readyState === 4 && xhr.status === 200) { return true; }
	else { return false; }
}

function isonliveid(data) {
	let server = client.guilds.cache.get(process.env.GUILD_ID);
	let announce = client.channels.cache.get(process.env.ANNOUNCE_CHANNEL)
	let logs = client.channels.cache.get(process.env.LOGS_CHANNEL)
	
	let twitchData = new XMLHttpRequest();
	let twitchAuth = new XMLHttpRequest();
	let twitchAPI = 'https://api.twitch.tv/helix/streams?user_id=' + data.twitch_id;
	let twitchToken = 'https://id.twitch.tv/oauth2/token?client_id='
	+ process.env.TWITCH_CLIENT_TOKEN + '&client_secret='
	+ process.env.TWITCH_SECRET_TOKEN + '&grant_type=client_credentials&scope=viewing_activity_read';
	
	twitchAuth.onreadystatechange = function(e) {
		if(xhrCheck(twitchAuth)) {
			if(debug == true) { console.log('AUTH : [\x1b[32mDONE\x1b[0m  (STATUS : '+ twitchAuth.status +')(STATE : '+ twitchAuth.readyState +')]'); }
			let twitchCode = JSON.parse(twitchAuth.responseText); // on récupère les infos

			twitchData.onreadystatechange = function() {
				if(xhrCheck(twitchData) === true) {
					if(debug == true) { console.log('DATA : [\x1b[32mDONE\x1b[0m  (STATUS : '+ twitchData.status +')(STATE : '+ twitchData.readyState +')]'); }
					let twitchResponse = JSON.parse(twitchData.responseText).data[0];
					
					// id du rôle que l'on souhaite attribuer
					var role_id = process.env.LIVE_ROLE;
					if(debug == true) { var channel_id = client.channels.cache.get(process.env.LOGS_CHANNEL); }

					if(twitchResponse != undefined){
                        // [ONLINE] si le rôle y est on ne fait rien sinon on le donne à l'utilisateur
						if(debug == true) { console.log('ETAT : [\x1b[32mONLINE \x1b[0m (' + data.twitch_id + ')]'); }
						let streamClock = Date.parse(twitchResponse.started_at);

						let now = Date.parse(new Date());
						let pre = now - 300000; // On retire 5 minutes
						let nex = now + 300000; // On ajoute 5 minutes

						if(streamClock > pre && streamClock < nex) {
							if(debug == true) {
								console.log('On envoie le message');
								logs.send(`Hey <@${process.env.EVERYONE}> ! <@${data.discord_id}> est actuellement en live sur https://twitch.tv/${data.twitch_name} il stream **${twitchResponse.title}** sur ${twitchResponse.game_name}`);
							}
							else {
								announce.send(`Hey <@${process.env.EVERYONE}> ! <@${data.discord_id}> est actuellement en live sur https://twitch.tv/${data.twitch_name} il stream **${twitchResponse.title}** sur ${twitchResponse.game_name}`);
							}
						}
						else { console.log('Pas de message');; }
                    }
                    else {
                        // [OFFLINE] on enlève le rôle si il y est
						if(debug == true) { console.log('ETAT : [\x1b[31mOFFLINE \x1b[0m (' + data.twitch_id + ')]'); }
                    }
				}
			}
			twitchData.open('GET', twitchAPI, false);
			twitchData.setRequestHeader('client-id', 'wjgieag2lzo09xwh1n2uyoaii3amij');
			twitchData.setRequestHeader('Authorization', 'Bearer ' + twitchCode['access_token']);
			twitchData.send();
		}
	}
	twitchAuth.open('POST', twitchToken, false);
	twitchAuth.send();
}

client.on('ready', () => {
	console.log(`[Logged in as \x1b[44m\x1b[30m${client.user.tag}\x1b[0m]`);
	console.log(`[\x1b[44m\x1b[30m${client.user.tag}\x1b[0m as now starting 5 minutes countdown]`);

	if(wait == true) {
		setInterval(function() {
			console.log(`[\x1b[44m\x1b[30m${client.user.tag}\x1b[0m as waiting 5 minutes]`);
			console.log(`[\x1b[44m\x1b[30m${client.user.tag}\x1b[0m as starting his work]`);
			discordBotLive();
			console.log(`[\x1b[44m\x1b[30m${client.user.tag}\x1b[0m as ending his work]`);
		}, 300000);
	}
	else { discordBotLive(); }
});

client.login(process.env.BOT_TOKEN);