import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { Player } from 'discord-player';
import logger from '#Logger';
import fs from 'fs';

const commandFiles = fs.readdirSync('./Discord/Commands').filter((file) => file.endsWith('.js'));
let commands = [];

(async () => {
    for (const file of commandFiles) {
        const command = await import(`./Commands/${file}`);
        commands.push(command.data.data.toJSON());
    }
})();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
});

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
});

client.on('ready', () => {
    logger.info('Bot is ready!');

    let guilds = client.guilds.cache.map((g) => g.id);
    guilds.forEach(async (id) => {
        try {
            const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, id), {
                body: commands,
            });
            logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (err) {
            logger.error(err);
        }
    });
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.type !== 2) return;

    const command = await import(`./Commands/${interaction.commandName}.js`);
    await command.data.run({ client, interaction });
});

client.login(process.env.BOT_TOKEN);
