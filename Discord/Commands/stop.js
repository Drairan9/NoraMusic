import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export const data = {
    data: new SlashCommandBuilder().setName('stop').setDescription('Leave voice channel'),

    run: async ({ client, interaction }) => {
        if (interaction.member.voice.channelId === null) {
            interaction.reply('NO VC');
            return;
        }

        const queue = client.player.getQueue(interaction.guild.id);
        queue.destroy();

        interaction.reply('xd');
    },
};
