import { SlashCommandBuilder } from 'discord.js';
import { QueryType } from 'discord-player';

export const data = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play song')
        .addStringOption((option) => option.setName('url').setDescription("the song's url").setRequired(true)),

    run: async ({ client, interaction }) => {
        if (interaction.member.voice.channelId === null) {
            interaction.reply('NO VC');
            return;
        }

        let url = interaction.options.getString('url');

        await interaction.reply('Thinking..');

        ///// IMPORTED

        const queue = await client.player.createQueue(interaction.guild);
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        const result = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });
        if (result.tracks.length === 0) return interaction.editReply('No results');

        // const song = result.tracks[0];
        // await queue.addTrack(song);
        result.playlist ? queue.addTracks(result.tracks) : queue.addTrack(result.tracks[0]);

        if (!queue.playing) await queue.play();

        result.playlist
            ? await interaction.editReply(`Added ${result.tracks.length} songs`)
            : await interaction.editReply(`Added song **${result.tracks[0].title}**`);
    },
};
