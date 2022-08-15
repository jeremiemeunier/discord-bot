const fs = require('fs');
let secret_settings = JSON.parse(fs.readFileSync('data/secret.json'));

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'role') {
    await interaction.reply({ content:'Tu dois indiquer un nom de rôle par exemple : `/role add 1` pour les connaîtres : `/role list` ou `/role notifs` selon les notifications que tu souhaite recevoir. Si tu veux te retirer un rôle fait `/role remove 1`', fetchReplay:true });
  }
  else if(interaction.commandName === 'poll') {
    let questionValue = `${interaction.guild.emojis.cache.find(emoji => emoji.name === 'bichon_poll')} **${interaction.options.getString("question")}**`;
    let responseOptions = interaction.options.getString("response").split(';');
    let responseLenght = Object.keys(responseOptions).length;
    let aswerText = "";

    for(let i = 0; i < responseLenght; i++) {
      let responseText = responseOptions[i];
      if(i === 0) { aswerText += `1️⃣  ${responseText}\r\n`; }
      else if(i === 1) { aswerText += `2️⃣  ${responseText}\r\n`; }
      else if(i === 2) { aswerText += `3️⃣  ${responseText}\r\n`; }
      else if(i === 3) { aswerText += `4️⃣  ${responseText}\r\n`; }
      else if(i === 4) { aswerText += `5️⃣  ${responseText}\r\n`; }
    }

    const pollEmbed = new EmbedBuilder()
                            .setColor("060D25")
                            .setDescription(aswerText);
    const message = await interaction.reply({ content: questionValue, embeds: [pollEmbed], fetchReply: true });

    for(var i = 0; i < responseLenght; i++) {
      if(i === 0) { message.react('1️⃣'); }
      else if(i === 1) { message.react('2️⃣'); }
      else if(i === 2) { message.react('3️⃣'); }
      else if(i === 3) { message.react('4️⃣'); }
      else if(i === 4) { message.react('5️⃣'); }
    }
  }
});

client.login(secret_settings.BOT_TOKEN);
