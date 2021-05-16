const Discord = require('discord.js')
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const debug = false; // set as TRUE for console.log most important states

const envConfig = dotenv.parse(fs.readFileSync('./.env'))
for (const k in envConfig) {
    process.env[k] = envConfig[k]
}


var client = new Discord.Client();

client.on('ready', () => {
	console.log(`[Logged in as \x1b[44m\x1b[30m${client.user.tag}\x1b[0m]`);
	discordBotLive();
	console.log(`[\x1b[44m\x1b[30m${client.user.tag}\x1b[0m as ending his work]`)
});

function discordBotLive() {
	var dataUsers = [{"discord_id":"165806292840087552","discord_name":"DarkBichon","twitch_id":"127396424","twitch_name":"dark_bichon"},{"discord_id":"222776756870971393","discord_name":"WyZzeur","twitch_id":"39928727","twitch_name":"WyZzeur"},{"discord_id":"105263001388507136","discord_name":"Leha","twitch_id":"73474297","twitch_name":"Leha83"},{"discord_id":"223352044730318859","discord_name":"Nekzq.","twitch_id":"601540513","twitch_name":"nekzq"}];
	var dataLenght = dataUsers.length;

	for(var i = 0; i < dataLenght; i++) {
		let data = dataUsers[i];
		isonliveid(data.twitch_id, data.discord_id);
	}
}
function xhrCheck(xhr) {
	if(debug == true) { console.log('DEBUG : \x1b[43m\x1b[30mCHECK [(STATE : '+ xhr.readyState +')(STATUS : '+ xhr.status +')]\x1b[0m'); }
	if(xhr.readyState === 4 && xhr.status === 200) { return true; }
	else { return false; }
}

function isonliveid(streamerId, discordId) {
	let twitchData = new XMLHttpRequest();
	let twitchAuth = new XMLHttpRequest();
	let twitchAPI = 'https://api.twitch.tv/helix/streams?user_id=' + streamerId;
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
					var role_id = '758749743433121852';
                    
					if(twitchResponse != undefined){
                        // [ONLINE] si le rôle y est on ne fait rien sinon on le donne à l'utilisateur
						// Discord
						console.log('ETAT : [\x1b[32mONLINE \x1b[0m (' + streamerId + ')]');
                    }
                    else {
                        // [OFFLINE] on enlève le rôle si il y est
						// Discord
						console.log('ETAT : [\x1b[31mOFFLINE \x1b[0m (' + streamerId + ')]');
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

client.login(process.env.BOT_TOKEN);
