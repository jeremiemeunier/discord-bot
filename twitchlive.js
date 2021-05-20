const Discord = require('discord.js')
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const envConfig = dotenv.parse(fs.readFileSync('./.env'));
for (const k in envConfig) {
    process.env[k] = envConfig[k]
}

var json_settings = fs.readFileSync('booty.json');
var booty_settings = JSON.parse(json_settings);
var bootyLog = `\x1b[32m bootyJS[${booty_settings.version}] \x1b[0m`;

console.log(`\x1b[42m\x1b[30m ### booty JS  [${booty_settings.version}] INITIALIZE ### \x1b[0m `);

if(booty_settings.debug == true) {
	console.log(`${bootyLog} \x1b[43m\x1b[30m ### DEBUG IS ENABLED ### \x1b[0m `);
	console.log(`${bootyLog} using \x1b[34m${booty_settings.channel.debug}\x1b[0m channel to send his messages`);
} else {
	console.log(`${bootyLog} \x1b[43m\x1b[30m ### DEBUG IS DISABLED ### \x1b[0m `);
	console.log(`${bootyLog} using \x1b[34m${booty_settings.channel.announce}\x1b[0m channel to send his messages`);
}


var client = new Discord.Client();

function discordBotLive() {
	var JsonUsers = fs.readFileSync('live_config.json');
	var dataUsers = JSON.parse(JsonUsers);
	var dataLenght = Object.keys(dataUsers).length;

	for(var i = 0; i < dataLenght; i++) {
		let data = dataUsers[i];
		isonliveid(data);
	}
}
function xhrCheck(xhr) {
	if(booty_settings.debug == true) {
		console.log(`\x1b[32m bootyJS[${booty_settings.version}] \x1b[0m\x1b[43m\x1b[30m ### DEBUG : CHECK [(STATE : ${xhr.readyState})(STATUS : ${xhr.status})] ### \x1b[0m `);
	}
	if(xhr.readyState === 4 && xhr.status === 200) { return true; }
	else { return false; }
}

function dateReturn(ajd) {
	let ret;

	if(ajd.getHours() < 10) { ret += `0${ajd.getHours()}:`; } else { ret += `${ajd.getHours()}:`; }
	if(ajd.getMinutes() < 10) { ret += `0${ajd.getMinutes()}:`; } else { ret += `${ajd.getMinutes()}:`; }
	if(ajd.getSeconds() < 10) { ret += `0${ajd.getSeconds()}:`; } else { ret += `${ajd.getSeconds()}:`; }

	return ret;
}

function isonliveid(data) {
	let server = client.guilds.cache.get(process.env.GUILD_ID);
	let announce = client.channels.cache.find(channel => channel.name === booty_settings.channel.announce)
	let logs = client.channels.cache.find(channel => channel.name === booty_settings.channel.debug)
	let every = server.roles.cache.find(role => role.name === '@everyone');
	let dateajd = new Date();
	
	let twitchData = new XMLHttpRequest();
	let twitchAuth = new XMLHttpRequest();
	let twitchAPI = `https://api.twitch.tv/helix/streams?user_id=${data.twitch_id}`;
	let twitchToken = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_TOKEN}&client_secret=${process.env.TWITCH_SECRET_TOKEN}&grant_type=client_credentials&scope=viewing_activity_read`;
	
	twitchAuth.onreadystatechange = function(e) {
		if(xhrCheck(twitchAuth)) {
			if(booty_settings.debug == true) {
				console.log(`\x1b[32m bootyJS[${booty_settings.version}] ${dateReturn(dateajd)} \x1b[0mAUTH : [\x1b[32mDONE\x1b[0m  (STATUS : ${twitchAuth.status})(STATE : ${twitchAuth.readyState})]`); }
			let twitchCode = JSON.parse(twitchAuth.responseText);

			twitchData.onreadystatechange = function() {
				if(xhrCheck(twitchData) === true) {
					if(booty_settings.debug == true) {
						console.log(`\x1b[32m bootyJS[${booty_settings.version}] ${dateReturn(dateajd)} \x1b[0mDATA : [\x1b[32mDONE\x1b[0m  (STATUS : ${twitchData.status})(STATE : ${twitchData.readyState})]`); }
					let twitchResponse = JSON.parse(twitchData.responseText).data[0];

					if(twitchResponse != undefined){
						if(booty_settings.debug == true) {
							console.log(`\x1b[32m bootyJS[${booty_settings.version}] ${dateReturn(dateajd)} \x1b[0mETAT : [\x1b[32mONLINE \x1b[0m (${data.twitch_id})]`); }
						let streamClock = Date.parse(twitchResponse.started_at);

						let now = Date.parse(new Date());
						let pre = now - booty_settings.countdown;
						let nex = now + booty_settings.countdown;

						if(streamClock > pre && streamClock < nex) {
							if(booty_settings.debug == true) {
								console.log(`\x1b[32m bootyJS[${booty_settings.version}] ${dateReturn(dateajd)} \x1b[0mEnvoie le message`);
								logs.send(`Hey <@${every.id}> ! <@${data.discord_id}> est actuellement en live sur https://twitch.tv/${data.twitch_name} il stream **${twitchResponse.title}** sur ${twitchResponse.game_name}`);
							}
							else {
								announce.send(`Hey <@${every.id}> ! <@${data.discord_id}> est actuellement en live sur https://twitch.tv/${data.twitch_name} il stream **${twitchResponse.title}** sur ${twitchResponse.game_name}`);
							}
						}
						else { console.log(`\x1b[32m bootyJS[${version}] ${dateReturn(dateajd)} \x1b[0mPas de message`); }
                    }
                    else {
						if(booty_settings.debug == true) {
							console.log(`\x1b[32m bootyJS[${booty_settings.version}] ${dateReturn(dateajd)} \x1b[0mETAT : [\x1b[31mOFFLINE \x1b[0m (${data.twitch_id})]`); }
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
	console.log(`${bootyLog} as \x1b[34m${client.user.tag}\x1b[0m`);
	if(booty_settings.waiting == true) {
		console.log(`${bootyLog} countdown : \x1b[34m${booty_settings.countdown}ms\x1b[0m`);
		console.log(`${bootyLog} as now starting countdown`);
	}
	else { console.log(`${bootyLog} is to exited to wait`); }
	console.log(`\x1b[42m\x1b[30m ### booty JS  [${booty_settings.version}] STARTING ### \x1b[0m `);
	
	if(booty_settings.waiting == true) {
		setInterval(function() {
			let ajd = new Date();
			console.log(`\x1b[32m bootyJS[${booty_settings.version}] ${dateReturn(ajd)}\x1b[0m as waiting \x1b[34m${booty_settings.countdown}ms\x1b[0m`);
			console.log(`\x1b[32m bootyJS[${booty_settings.version}] ${dateReturn(ajd)}\x1b[0m as starting his work`);
			discordBotLive();
			console.log(`\x1b[32m bootyJS[${booty_settings.version}] ${dateReturn(ajd)}\x1b[0m as ending his work`);
			console.log(`\x1b[32m bootyJS[${booty_settings.version}] ${dateReturn(ajd)}\x1b[0m as now starting countdown`);
		}, booty_settings.countdown);
	}
	else { discordBotLive(); }
});

client.login(process.env.BOT_TOKEN);