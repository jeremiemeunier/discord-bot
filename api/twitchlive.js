let usersData = require('./live_config.json');

function xhrCheck(xhr) {
	if(xhr.readyState === 4 && xhr.status === 200) {
		return true;
	} else { return false; }
}

function isonliveid(streamerId) {
    let twitchData = new XMLHttpRequest();
    let twitchAuth = new XMLHttpRequest();
    let twitchAPI = 'https://api.twitch.tv/helix/streams?user_id=' + streamerId;
		let twitchToken = 'https://id.twitch.tv/oauth2/token?client_id=3eylv22fy24diagx1mrg45xs6cr5ln&client_secret=uve7gg2j0s5agk5dqr81llljatf4kl&grant_type=client_credentials&scope=viewing_activity_read';

    twitchAuth.onreadystatechange = function() {
        if(xhrCheck(twitchAuth)) {
            let twitchCode = JSON.parse(twitchAuth.response);
						
            twitchData.onreadystatechange = function() {
							if(xhrCheck(twitchData)) {
								let twitchResponse = JSON.parse(twitchData.response).data[0];

								if(twitchResponse === undefined) { console.log('Pas de stream'); }
								else { console.log('Il stream magueule'); }
							}
            }

            twitchData.open('GET', twitchAPI, true);
            twitchData.setRequestHeader('client-id', '3eylv22fy24diagx1mrg45xs6cr5ln');
            twitchData.setRequestHeader('Authorization', 'Bearer ' + twitchCode['access_token']);
            twitchData.send();
        }
    }

    twitchAuth.open('POST', twitchToken, true);
    twitchAuth.send();
}