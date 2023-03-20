import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';

export const data = {
    data: new SlashCommandBuilder().setName('stop').setDescription('Leave voice channel'),

    run: async ({ client, interaction }) => {
        if (interaction.member.voice.channelId === null) {
            interaction.reply('NO VC');
            return;
        }

        const queue = client.player.nodes.get(interaction.guild.id);
        if (!queue || !queue.node.isPlaying()) {
            interaction.reply('no playing');
            return;
        }

        const connection = getVoiceConnection(interaction.guild.id);

        if (connection) connection.destroy();
        if (queue) queue.destroy();

        interaction.reply('xd');
    },
};
