import { SlashCommandBuilder } from 'discord.js';
import { QueryType } from 'discord-player';
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';

export const data = {
    data: new SlashCommandBuilder().setName('dpp').setDescription('dev play playlist'),

    run: async ({ client, interaction }) => {
        if (interaction.member.voice.channelId === null) {
            interaction.reply('NO VC');
            return;
        }

        await interaction.reply('Thinking..');

        ///// IMPORTED

        const queue = await client.player.nodes.create(interaction.guild);
        // if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        if (!queue.connection) {
            joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            queue.connect(interaction.member.voice.channel);
        }

        const result = await client.player.search(
            'https://www.youtube.com/playlist?list=PL2TRsgSGFUWp4BfAs4fi6tUvBs-6yxrWK',
            {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            }
        );
        if (result.tracks.length === 0) return interaction.editReply('No results');

        queue.addTrack(result.tracks);

        if (!queue.node.isPlaying()) await queue.node.play();

        result.playlist
            ? await interaction.editReply(`Added ${result.tracks.length} songs`)
            : await interaction.editReply(`Added song **${result.tracks[0].title}**`);
    },
};
