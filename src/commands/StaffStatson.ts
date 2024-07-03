import { CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { QuickDB } from 'quick.db';

const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder().setName('staffstatson').setDescription('Subscribes channel to the Staff Stats tracker').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction: CommandInteraction) {

		const subscribedChannels = await db.get('StaffsubscribedChannels');
		if (!Array.isArray(subscribedChannels)) {
			await db.set('StaffsubscribedChannels', []);
		}

		if (!subscribedChannels || !subscribedChannels.includes(interaction.channelId)) {
			await db.push('StaffsubscribedChannels', interaction.channelId);

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
