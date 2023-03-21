import { SlashCommandBuilder } from 'discord.js';
import { QueryType } from 'discord-player';
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';

export const data = {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jump to song')
        .addStringOption((option) => option.setName('index').setDescription('song index').setRequired(true)),

    run: async ({ client, interaction }) => {
        if (interaction.member.voice.channelId === null) {
            interaction.reply('NO VC');
            return;
        }
        await interaction.reply('Thinking..');

        const queue = await client.player.nodes.create(interaction.guild);
        let index = interaction.options.getString('index');

        if (!queue) {
            return interaction.editReply({ content: 'There is no queue!' });
        }

        await queue.node.jump(parseInt(index));

        await interaction.editReply(`jumped`);
    },
};
