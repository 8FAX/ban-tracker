import { CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { QuickDB } from 'quick.db';

const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder().setName('banlogon').setDescription('Subscribes channel to the ban tracker').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction: CommandInteraction) {

		const subscribedChannels = await db.get('bansubscribedChannels');
		if (!Array.isArray(subscribedChannels)) {
			await db.set('bansubscribedChannels', []);
		}

		if (!subscribedChannels || !subscribedChannels.includes(interaction.channelId)) {
			await db.push('bansubscribedChannels', interaction.channelId);

			const embed = new EmbedBuilder()
				.setTitle('Success')
				.setColor('#2b2d31')
				.setDescription('This channel has been subscribed to the ban tracker.');
			interaction.reply({ embeds: [embed] });
		} else {
			const embed = new EmbedBuilder()
				.setTitle('Error')
				.setColor('#2b2d31')
				.setDescription('This channel was already subscribed to the ban tracker.');
			interaction.reply({ embeds: [embed] });
		}
	}
};
