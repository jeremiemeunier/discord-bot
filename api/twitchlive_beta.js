const Discord = require('discord.js')
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var client = new Discord.Client();

discordBotLive();

function discordBotLive() {
	var dataUsers = [{"discord_id":"165806292840087552","discord_name":"DarkBichon","twitch_id":"127396424","twitch_name":"dark_bichon"},{"discord_id":"222776756870971393","discord_name":"WyZzeur","twitch_id":"39928727","twitch_name":"WyZzeur"},{"discord_id":"105263001388507136","discord_name":"Leha","twitch_id":"73474297","twitch_name":"Leha83"},{"discord_id":"223352044730318859","discord_name":"Nekzq.","twitch_id":"601540513","twitch_name":"nekzq"},{"discord_id":"223352044730318859","discord_name":"Nekzq.","twitch_id":"141490402","twitch_name":"nekzq"}];
	var dataLenght = dataUsers.length;
	
	for(var i = 0; i < dataLenght; i++) {
		let data = dataUsers[i];
		isonliveid(data.twitch_id, data.discord_id);
	}
	return "wouf";
}
function xhrCheck(xhr) { if(xhr.readyState === 4 && xhr.status === 200) { return true; } else { return false; }}
function isonliveid(streamerId, discordId) {
	let twitchData = new XMLHttpRequest();
	let twitchAuth = new XMLHttpRequest();
	let twitchAPI = 'https://api.twitch.tv/helix/streams?user_id=' + streamerId;
	let twitchToken = 'https://id.twitch.tv/oauth2/token?client_id=wjgieag2lzo09xwh1n2uyoaii3amij&client_secret=6nhuvu0v8bsjddevl1k3z1nkwkrpg9&grant_type=client_credentials&scope=viewing_activity_read';
	
	twitchAuth.onreadystatechange = function(e) {
		if(xhrCheck(twitchAuth)) {
			let twitchCode = JSON.parse(twitchAuth.response); // on récupère les infos
			twitchData.onreadystatechange = function() {
				if(xhrCheck(twitchData) === true) {
					let twitchResponse = JSON.parse(twitchData.response).data[0];
					var user = new Discord.User(client, {"id" : discordId})
                    if(twitchResponse != undefined){
                        // en live on met le rôle live si pas et rien si y est déjà
						// Discord
						user.roles.add('758749743433121852');
                    }
                    else {
                        // Pas en live on enlève le rôle si il y est
						user.roles.remove('758749743433121852');
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

	return 'Bouh';
}

client.login('NzgyMjA3MDI1ODY1OTQ5MTk0.X8I1Dw.oykMfClJFb0wZ8Sp3DafT91uEtc');