import { CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { QuickDB } from 'quick.db';

const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder().setName('staffstatsoff').setDescription('Unsubscribes channel to the staff Stats tracker').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction: CommandInteraction) {
		await db.pull('StaffsubscribedChannels', interaction.channelId);

		const embed = new EmbedBuilder()
			.setTitle('Success')
			.setColor('#2b2d31')
			.setDescription('This channel has been unsubscribed from the ban tracker.');
		interaction.reply({ embeds: [embed] });
	}
};
