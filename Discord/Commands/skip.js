import { SlashCommandBuilder } from 'discord.js';
import { QueryType } from 'discord-player';

export const data = {
    data: new SlashCommandBuilder().setName('skip').setDescription('Play song'),

    run: async ({ client, interaction }) => {
        if (interaction.member.voice.channelId === null) {
            interaction.reply('NO VC');
            return;
        }

        let url = interaction.options.getString('url');

        await interaction.reply('Thinking..');

        ///// IMPORTED

        const queue = await client.player.createQueue(interaction.guild);
        if (!queue.connection) return interaction.reply('no queue');

        const success = queue.skip();

        interaction.editReply(success ? 'Skipped' : 'Error');
    },
};
