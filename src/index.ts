import { ChannelType, EmbedBuilder, GatewayIntentBits, time } from 'discord.js';
import { QuickDB } from 'quick.db';
import { config } from './utils/config';
import fetch from 'cross-fetch';
import fs from 'node:fs';
import fs2 from 'fs/promises';
import path from 'node:path';
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const db = new QuickDB();

// load events
const eventsPath = path.join(__dirname, './events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));

(async () => {
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = await import(filePath);
		if (event.once) {
			client.once(event.name, (...args: any) => event.execute(...args));
		} else {
			client.on(event.name, (...args: any) => event.execute(...args));
		}
	}
})();

// little helper function to make 'player' plural if needed
const pluralPlayer = (num: number) => (num === 1 ? 'player' : 'players');

// function to grab all subscribed channels and send the embed to them
const sendban = async (embed: EmbedBuilder) => {
	const subscribedChannels = await db.get('bansubscribedChannels');

	if (!Array.isArray(subscribedChannels)) {
		return;
	}

	for (const channelId of subscribedChannels) {
		const channel = client.channels.cache.get(channelId);
		if (!channel || channel.type !== ChannelType.GuildText) {
			continue;
		}
		channel.send({ embeds: [embed] });
	}
};

const sendwdstats = async (embed: EmbedBuilder) => {
	const subscribedChannels2 = await db.get('WdsubscribedChannels');

	if (!Array.isArray(subscribedChannels2)) {
		return;
	}

	for (const channelId of subscribedChannels2) {
		const channel = client.channels.cache.get(channelId);
		if (!channel || channel.type !== ChannelType.GuildText) {
			continue;
		}
		channel.send({ embeds: [embed] });
	}
};
const sendStaffstats = async (embed: EmbedBuilder) => {
	const subscribedChannels3 = await db.get('StaffsubscribedChannels');

	if (!Array.isArray(subscribedChannels3)) {
		return;
	}

	for (const channelId of subscribedChannels3) {
		const channel = client.channels.cache.get(channelId);
		if (!channel || channel.type !== ChannelType.GuildText) {
			continue;
		}
		channel.send({ embeds: [embed] });
	}
};



// actual ban tracker
let watchdogBans = 0;
let staffBans = 0;

setInterval(async (): Promise<void> => {
	const res = await fetch('https://api.hypixel.net/punishmentStats?key=a383d452-099b-4a25-931b-eacb8a9e6873', {
		method: 'GET',
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
		}
	}).then((res) => res.json());

	const newWatchdogBans = res.watchdog_total;
	const newStaffBans = res.staff_total;
	const watchdogBanDifference = newWatchdogBans - watchdogBans;
	const staffBanDifference = newStaffBans - staffBans;
	const staff_30m_FILE_PATH = './src/data/ban/staff/staff_30m_event_data.json';
	const staff_1h_FILE_PATH = './src/data/ban/staff/staff_1h_event_data.json';
	const staff_6h_FILE_PATH = './src/data/ban/staff/staff_6h_event_data.json';
	const staff_12h_FILE_PATH = './src/data/ban/staff/staff_12h_event_data.json';
	const staff_24h_FILE_PATH = './src/data/ban/staff/staff_24h_event_data.json';
	const staff_7d_FILE_PATH = './src/data/ban/staff/staff_7d_event_data.json';
	const staff_30d_FILE_PATH = './src/data/ban/staff/staff_30d_event_data.json';
	const staff_1y_FILE_PATH = './src/data/ban/staff/staff_1y_event_data.json';
	const staff_alltime_FILE_PATH = './src/data/ban/staff/staff_alltime_event_data.json';
	const Watchdog_30m_FILE_PATH = './src/data/ban/watchdog/watchdog_30m_event_data.json';
	const Watchdog_1h_FILE_PATH = './src/data/ban/watchdog/watchdog_1h_event_data.json';
	const Watchdog_6h_FILE_PATH = './src/data/ban/watchdog/watchdog_6h_event_data.json';
	const Watchdog_12h_FILE_PATH = './src/data/ban/watchdog/watchdog_12h_event_data.json';
	const Watchdog_24h_FILE_PATH = './src/data/ban/watchdog/watchdog_24h_event_data.json';
	const Watchdog_7d_FILE_PATH = './src/data/ban/watchdog/watchdog_7d_event_data.json';
	const Watchdog_30d_FILE_PATH = './src/data/ban/watchdog/watchdog_30d_event_data.json';
	const Watchdog_1y_FILE_PATH = './src/data/ban/watchdog/watchdog_1y_event_data.json';
	const Watchdog_alltime_FILE_PATH = './src/data/ban/watchdog/watchdog_alltime_event_data.json';
	const timestamp = Date.now();
	const watchdogformattedData = `${watchdogBanDifference}:${timestamp} 
	0`;

	// if statement to check if its the first time running the function
	if (watchdogBans !== 0 && staffBans !== 0) {
		// if there are new watchdog bans, send an embed to all subscribed channels
		if (watchdogBanDifference > 0) {
			const embed = new EmbedBuilder()
				.setAuthor({ name: `Watchdog banned ${watchdogBanDifference} ${pluralPlayer(watchdogBanDifference)}.` })
				.setColor('#ffff00')
				.setDescription(`${time(new Date(), 'R')}`);
			sendban(embed);

			console.log(`New WatchDog ban! : ${watchdogBanDifference}`);

			// Time 

/* The code is calculating different time intervals relative to the current time. It calculates
the time that is 30 minutes ago, 1 hour ago, 6 hours ago, 12 hours ago, 24 hours ago, 7 days ago, 30
days ago, and 365 days ago. The time intervals are calculated in milliseconds. */

const currentTime = Date.now();
const thirtymAgo = currentTime - 30 * 60 * 1000;
const oneHAgo = currentTime - 60 * 60 * 1000;
const sixHAgo = currentTime - 6 * 60 * 60 * 1000;
const onetwoHAgo = currentTime - 12 * 60 * 60 * 1000;
const twofourHAgo = currentTime - 24 * 60 * 60 * 1000;
const sevendAgo = currentTime - 7 * 24 * 60 * 60 * 1000;
const thirtydAgo = currentTime - 30 * 24 * 60 * 60 * 1000;
const oneyAgo = currentTime - 365 * 24 * 60 * 60 * 1000;

/* The code is tracking and storing data related to Watchdog bans. It reads data from JSON files,
adds new data to the files, removes old data, calculates the total number of bans within specific
time intervals, and logs the totals. It also creates embed messages with the ban statistics and
sends them. */
			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let watchdog30meventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(Watchdog_30m_FILE_PATH, 'utf-8');
				watchdog30meventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			watchdog30meventData[timestamp.toString()] = watchdogBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(Watchdog_30m_FILE_PATH, JSON.stringify(watchdog30meventData, null, 2));

			// Remove data older than 12 hours
			
			for (const ts in watchdog30meventData) {
				if (parseInt(ts) < thirtymAgo) {
					delete watchdog30meventData[ts];
				}
			}
			await fs2.writeFile(Watchdog_30m_FILE_PATH, JSON.stringify(watchdog30meventData, null, 2));

			// Calculate and log total of the past 30 Minutes
			let total1 = 0;
			for (const ts in watchdog30meventData) {
				total1 += watchdog30meventData[ts];
			}
			console.log(`Total of the past 30 Minutes : ${total1}`);

			const embed2 = new EmbedBuilder()
				.setAuthor({ name: `Watchdog banned a total **${total1}** accounts in the past 30 Minutes.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let watchdog1heventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(Watchdog_1h_FILE_PATH, 'utf-8');
				watchdog1heventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			watchdog1heventData[timestamp.toString()] = watchdogBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(Watchdog_1h_FILE_PATH, JSON.stringify(watchdog1heventData, null, 2));

			// Remove data older than 1 hour
			for (const ts in watchdog1heventData) {
				if (parseInt(ts) < oneHAgo) {
					delete watchdog1heventData[ts];
				}
			}
			await fs2.writeFile(Watchdog_1h_FILE_PATH, JSON.stringify(watchdog1heventData, null, 2));

			// Calculate and log total of the past 1 hour
			let total2 = 0;
			for (const ts in watchdog1heventData) {
				total2 += watchdog1heventData[ts];
			}
			console.log(`Total of the past 1 hour : ${total2}`);

			const embed4 = new EmbedBuilder()
				.setAuthor({ name: `Watchdog banned a total **${total2}** accounts in the past 1 hour.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let watchdog6heventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(Watchdog_6h_FILE_PATH, 'utf-8');
				watchdog6heventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			watchdog6heventData[timestamp.toString()] = watchdogBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(Watchdog_6h_FILE_PATH, JSON.stringify(watchdog6heventData, null, 2));

			// Remove data older than 1 hour
			for (const ts in watchdog6heventData) {
				if (parseInt(ts) < sixHAgo) {
					delete watchdog6heventData[ts];
				}
			}
			await fs2.writeFile(Watchdog_6h_FILE_PATH, JSON.stringify(watchdog6heventData, null, 2));

			// Calculate and log total of the past 1 hour
			let total3 = 0;
			for (const ts in watchdog6heventData) {
				total3 += watchdog6heventData[ts];
			}
			console.log(`Total of the past 6 hour : ${total3}`);

			const embed3 = new EmbedBuilder()
				.setAuthor({ name: `Watchdog banned a total **${total3}** accounts in the past 6 hour` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let watchdog12heventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(Watchdog_12h_FILE_PATH, 'utf-8');
				watchdog12heventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			watchdog12heventData[timestamp.toString()] = watchdogBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(Watchdog_12h_FILE_PATH, JSON.stringify(watchdog12heventData, null, 2));

			// Remove data older than 1 hour
			for (const ts in watchdog12heventData) {
				if (parseInt(ts) < onetwoHAgo) {
					delete watchdog12heventData[ts];
				}
			}
			await fs2.writeFile(Watchdog_12h_FILE_PATH, JSON.stringify(watchdog12heventData, null, 2));

			// Calculate and log total of the past 1 hour
			let total4 = 0;
			for (const ts in watchdog12heventData) {
				total4 += watchdog12heventData[ts];
			}
			console.log(`Total of the past 12 hour : ${total4}`);

			const embed5 = new EmbedBuilder()
				.setAuthor({ name: `Watchdog banned a total **${total4}** accounts in the past 12 hours.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let watchdog24heventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(Watchdog_24h_FILE_PATH, 'utf-8');
				watchdog24heventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			watchdog24heventData[timestamp.toString()] = watchdogBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(Watchdog_24h_FILE_PATH, JSON.stringify(watchdog24heventData, null, 2));

			// Remove data older than 1 hour
			for (const ts in watchdog24heventData) {
				if (parseInt(ts) < twofourHAgo) {
					delete watchdog24heventData[ts];
				}
			}
			await fs2.writeFile(Watchdog_24h_FILE_PATH, JSON.stringify(watchdog24heventData, null, 2));

			// Calculate and log total of the past 1 hour
			let total5 = 0;
			for (const ts in watchdog24heventData) {
				total5 += watchdog24heventData[ts];
			}
			console.log(`Total of the past 24 hour : ${total5}`);

			const embed6 = new EmbedBuilder()
				.setAuthor({ name: `Watchdog banned a total **${total5}** accounts in the past 24 hours.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let watchdog7deventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(Watchdog_7d_FILE_PATH, 'utf-8');
				watchdog7deventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			watchdog7deventData[timestamp.toString()] = watchdogBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(Watchdog_7d_FILE_PATH, JSON.stringify(watchdog7deventData, null, 2));

			// Remove data older than 7 days
			for (const ts in watchdog7deventData) {
				if (parseInt(ts) < sevendAgo) {
					delete watchdog7deventData[ts];
				}
			}
			await fs2.writeFile(Watchdog_7d_FILE_PATH, JSON.stringify(watchdog7deventData, null, 2));

			// Calculate and log total of the past 7 days
			let total6 = 0;
			for (const ts in watchdog7deventData) {
				total6 += watchdog7deventData[ts];
			}
			console.log(`Total of the past 7 days : ${total6}`);

			const embed7 = new EmbedBuilder()
				.setAuthor({ name: `Watchdog banned a total **${total6}** accounts in the past 7 days.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let watchdog30deventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(Watchdog_30d_FILE_PATH, 'utf-8');
				watchdog30deventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			watchdog30deventData[timestamp.toString()] = watchdogBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(Watchdog_30d_FILE_PATH, JSON.stringify(watchdog30deventData, null, 2));

			// Remove data older than 7 days
			for (const ts in watchdog30deventData) {
				if (parseInt(ts) < thirtydAgo) {
					delete watchdog30deventData[ts];
				}
			}
			await fs2.writeFile(Watchdog_30d_FILE_PATH, JSON.stringify(watchdog30deventData, null, 2));

			// Calculate and log total of the past 7 days
			let total7 = 0;
			for (const ts in watchdog30deventData) {
				total7 += watchdog30deventData[ts];
			}
			console.log(`Total of the past 30 days : ${total7}`);

			const embed8 = new EmbedBuilder()
				.setAuthor({ name: `Watchdog banned a total **${total7}** accounts in the past 30 days.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let watchdog1yeventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(Watchdog_1y_FILE_PATH, 'utf-8');
				watchdog1yeventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			watchdog1yeventData[timestamp.toString()] = watchdogBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(Watchdog_1y_FILE_PATH, JSON.stringify(watchdog1yeventData, null, 2));

			// Remove data older than 1 Year
			for (const ts in watchdog1yeventData) {
				if (parseInt(ts) < oneyAgo) {
					delete watchdog1yeventData[ts];
				}
			}
			await fs2.writeFile(Watchdog_1y_FILE_PATH, JSON.stringify(watchdog1yeventData, null, 2));

			// Calculate and log total of the past 1 Year
			let total8 = 0;
			for (const ts in watchdog1yeventData) {
				total8 += watchdog1yeventData[ts];
			}
			console.log(`Total of the past 1 Year : ${total8}`);

			const embed9 = new EmbedBuilder()
				.setAuthor({ name: `Watchdog banned a total **${total8}** accounts in the past 1 Year.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let watchdogalltimeeventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(Watchdog_alltime_FILE_PATH, 'utf-8');
				watchdogalltimeeventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			watchdogalltimeeventData[timestamp.toString()] = watchdogBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(Watchdog_alltime_FILE_PATH, JSON.stringify(watchdogalltimeeventData, null, 2));

			// Calculate and log total of the past 1 Year
			let total9 = 0;
			for (const ts in watchdogalltimeeventData) {
				total9 += watchdogalltimeeventData[ts];
			}
			console.log(`Total Of all Watchdog bans tracked : ${total9}`);

			const embed10 = new EmbedBuilder()
				.setAuthor({ name: `Watchdog *Tracked* banned total **${total9}**` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			const embednew = new EmbedBuilder()
				.setAuthor({ name: `WatchDog Ban Stats` })
				.setColor('#986dfd')
				.setDescription(
					`\nPast 30 Minutes : **${total1}**\nPast 1 Hour : **${total2}**\nPast 6 Hours :**${total3}**\nPast 12 Hours : **${total4}**\nPast 24 Hours : **${total5}**\nPast 7 Days : **${total6}**\nPast 30 Days : **${total7}**\nPast 1 year : **${total8}**\nAll tracked bans : **${total9}**\n\n${time(
						new Date(),
						'R'
					)}`
				);

			// // send(embed2);
			// // send(embed3);
			// // send(embed4);
			// // send(embed5);
			// // send(embed6);
			// // send(embed7);
			// // send(embed8);
			// // send(embed9);
			// // send(embed10);
			// // sendban(embednew)
			sendwdstats(embednew);
		}

		// if there are new staff bans, send an embed to all subscribed channels

		if (staffBanDifference > 0) {
			const embed = new EmbedBuilder()
				.setAuthor({ name: `Staff banned ${staffBanDifference} ${pluralPlayer(staffBanDifference)}.` })
				.setColor('#ff0000')
				.setDescription(`${time(new Date(), 'R')}`);
			sendban(embed);

			console.log(`New Staff ban! : ${staffBanDifference}`);

			// Time 
/* The code is calculating different time intervals relative to the current time. It calculates
the time that is 30 minutes ago, 1 hour ago, 6 hours ago, 12 hours ago, 24 hours ago, 7 days ago, 30
days ago, and 365 days ago. The time intervals are calculated in milliseconds. */
const currentTime = Date.now();
const thirtymAgo = currentTime - 30 * 60 * 1000;
const oneHAgo = currentTime - 60 * 60 * 1000;
const sixHAgo = currentTime - 6 * 60 * 60 * 1000;
const onetwoHAgo = currentTime - 12 * 60 * 60 * 1000;
const twofourHAgo = currentTime - 24 * 60 * 60 * 1000;
const sevendAgo = currentTime - 7 * 24 * 60 * 60 * 1000;
const thirtydAgo = currentTime - 30 * 24 * 60 * 60 * 1000;
const oneyAgo = currentTime - 365 * 24 * 60 * 60 * 1000;

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let staff30meventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(staff_30m_FILE_PATH, 'utf-8');
				staff30meventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			staff30meventData[timestamp.toString()] = staffBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(staff_30m_FILE_PATH, JSON.stringify(staff30meventData, null, 2));

			// Remove data older than 12 hours
			
			for (const ts in staff30meventData) {
				if (parseInt(ts) < thirtymAgo) {
					delete staff30meventData[ts];
				}
			}
			await fs2.writeFile(staff_30m_FILE_PATH, JSON.stringify(staff30meventData, null, 2));

			// Calculate and log total of the past 30 Minutes
			let total1 = 0;
			for (const ts in staff30meventData) {
				total1 += staff30meventData[ts];
			}
			console.log(`Total of the past 30 Minutes : ${total1}`);

			const embed2 = new EmbedBuilder()
				.setAuthor({ name: `Staff banned a total **${total1}** accounts in the past 30 Minutes.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let staff1heventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(staff_1h_FILE_PATH, 'utf-8');
				staff1heventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			staff1heventData[timestamp.toString()] = staffBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(staff_1h_FILE_PATH, JSON.stringify(staff1heventData, null, 2));

			// Remove data older than 1 hour
			for (const ts in staff1heventData) {
				if (parseInt(ts) < oneHAgo) {
					delete staff1heventData[ts];
				}
			}
			await fs2.writeFile(staff_1h_FILE_PATH, JSON.stringify(staff1heventData, null, 2));

			// Calculate and log total of the past 1 hour
			let total2 = 0;
			for (const ts in staff1heventData) {
				total2 += staff1heventData[ts];
			}
			console.log(`Total of the past 1 hour : ${total2}`);

			const embed4 = new EmbedBuilder()
				.setAuthor({ name: `Staff banned a total **${total2}** accounts in the past 1 hour.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let staff6heventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(staff_6h_FILE_PATH, 'utf-8');
				staff6heventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			staff6heventData[timestamp.toString()] = staffBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(staff_6h_FILE_PATH, JSON.stringify(staff6heventData, null, 2));

			// Remove data older than 1 hour
			for (const ts in staff6heventData) {
				if (parseInt(ts) < sixHAgo) {
					delete staff6heventData[ts];
				}
			}
			await fs2.writeFile(staff_6h_FILE_PATH, JSON.stringify(staff6heventData, null, 2));

			// Calculate and log total of the past 1 hour
			let total3 = 0;
			for (const ts in staff6heventData) {
				total3 += staff6heventData[ts];
			}
			console.log(`Total of the past 6 hour : ${total3}`);

			const embed3 = new EmbedBuilder()
				.setAuthor({ name: `Staff banned a total **${total3}** accounts in the past 6 hour` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let staff12heventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(staff_12h_FILE_PATH, 'utf-8');
				staff12heventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			staff12heventData[timestamp.toString()] = staffBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(staff_12h_FILE_PATH, JSON.stringify(staff12heventData, null, 2));

			// Remove data older than 1 hour
			for (const ts in staff12heventData) {
				if (parseInt(ts) < onetwoHAgo) {
					delete staff12heventData[ts];
				}
			}
			await fs2.writeFile(staff_12h_FILE_PATH, JSON.stringify(staff12heventData, null, 2));

			// Calculate and log total of the past 1 hour
			let total4 = 0;
			for (const ts in staff12heventData) {
				total4 += staff12heventData[ts];
			}
			console.log(`Total of the past 12 hour : ${total4}`);

			const embed5 = new EmbedBuilder()
				.setAuthor({ name: `Staff banned a total **${total4}** accounts in the past 12 hours.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let staff24heventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(staff_24h_FILE_PATH, 'utf-8');
				staff24heventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			staff24heventData[timestamp.toString()] = staffBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(staff_24h_FILE_PATH, JSON.stringify(staff24heventData, null, 2));

			// Remove data older than 1 hour
			for (const ts in staff24heventData) {
				if (parseInt(ts) < twofourHAgo) {
					delete staff24heventData[ts];
				}
			}
			await fs2.writeFile(staff_24h_FILE_PATH, JSON.stringify(staff24heventData, null, 2));

			// Calculate and log total of the past 1 hour
			let total5 = 0;
			for (const ts in staff24heventData) {
				total5 += staff24heventData[ts];
			}
			console.log(`Total of the past 24 hour : ${total5}`);

			const embed6 = new EmbedBuilder()
				.setAuthor({ name: `Staff banned a total **${total5}** accounts in the past 24 hours.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let staff7deventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(staff_7d_FILE_PATH, 'utf-8');
				staff7deventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			staff7deventData[timestamp.toString()] = staffBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(staff_7d_FILE_PATH, JSON.stringify(staff7deventData, null, 2));

			// Remove data older than 7 days
			for (const ts in staff7deventData) {
				if (parseInt(ts) < sevendAgo) {
					delete staff7deventData[ts];
				}
			}
			await fs2.writeFile(staff_7d_FILE_PATH, JSON.stringify(staff7deventData, null, 2));

			// Calculate and log total of the past 7 days
			let total6 = 0;
			for (const ts in staff7deventData) {
				total6 += staff7deventData[ts];
			}
			console.log(`Total of the past 7 days : ${total6}`);

			const embed7 = new EmbedBuilder()
				.setAuthor({ name: `Staff banned a total **${total6}** accounts in the past 7 days.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let staff30deventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(staff_30d_FILE_PATH, 'utf-8');
				staff30deventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			staff30deventData[timestamp.toString()] = staffBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(staff_30d_FILE_PATH, JSON.stringify(staff30deventData, null, 2));

			// Remove data older than 7 days
			for (const ts in staff30deventData) {
				if (parseInt(ts) < thirtydAgo) {
					delete staff30deventData[ts];
				}
			}
			await fs2.writeFile(staff_30d_FILE_PATH, JSON.stringify(staff30deventData, null, 2));

			// Calculate and log total of the past 7 days
			let total7 = 0;
			for (const ts in staff30deventData) {
				total7 += staff30deventData[ts];
			}
			console.log(`Total of the past 30 days : ${total7}`);

			const embed8 = new EmbedBuilder()
				.setAuthor({ name: `Staff banned a total **${total7}** accounts in the past 30 days.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let staff1yeventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(staff_1y_FILE_PATH, 'utf-8');
				staff1yeventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			staff1yeventData[timestamp.toString()] = staffBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(staff_1y_FILE_PATH, JSON.stringify(staff1yeventData, null, 2));

			// Remove data older than 1 Year
			for (const ts in staff1yeventData) {
				if (parseInt(ts) < oneyAgo) {
					delete staff1yeventData[ts];
				}
			}
			await fs2.writeFile(staff_1y_FILE_PATH, JSON.stringify(staff1yeventData, null, 2));

			// Calculate and log total of the past 1 Year
			let total8 = 0;
			for (const ts in staff1yeventData) {
				total8 += staff1yeventData[ts];
			}
			console.log(`Total of the past 1 Year : ${total8}`);

			const embed9 = new EmbedBuilder()
				.setAuthor({ name: `Staff banned a total **${total8}** accounts in the past 1 Year.` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			//------------------------------//------------------------------//------------------------------//------------------------------//------------------------------
			let staffalltimeeventData: { [timestamp: string]: number } = {};
			try {
				const fileContent = await fs2.readFile(staff_alltime_FILE_PATH, 'utf-8');
				staffalltimeeventData = JSON.parse(fileContent);
			} catch (error) {
				// File doesn't exist or is empty, continue with empty eventData
			}

			// Add new data to the eventData
			staffalltimeeventData[timestamp.toString()] = staffBanDifference;

			// Write updated JSON data back to the file
			await fs2.writeFile(staff_alltime_FILE_PATH, JSON.stringify(staffalltimeeventData, null, 2));

			// Calculate and log total of the past 1 Year
			let total9 = 0;
			for (const ts in staffalltimeeventData) {
				total9 += staffalltimeeventData[ts];
			}
			console.log(`Total Of all staff bans tracked : ${total9}`);

			const embed10 = new EmbedBuilder()
				.setAuthor({ name: `staff *Tracked* banned total **${total9}**` })
				.setColor('#986dfd')
				.setDescription(`${time(new Date(), 'R')}`);

			const embednew = new EmbedBuilder()
				.setAuthor({ name: `Staff Ban Stats` })
				.setColor('#986dfd')
				.setDescription(
					`\nPast 30 Minutes : **${total1}**\nPast 1 Hour : **${total2}**\nPast 6 Hours :**${total3}**\nPast 12 Hours : **${total4}**\nPast 24 Hours : **${total5}**\nPast 7 Days : **${total6}**\nPast 30 Days : **${total7}**\nPast 1 year : **${total8}**\nAll tracked bans : **${total9}**\n\n${time(
						new Date(),
						'R'
					)}`
				);

			// // send(embed2);
			// // send(embed3);
			// // send(embed4);
			// // send(embed5);
			// // send(embed6);
			// // send(embed7);
			// // send(embed8);
			// // send(embed9);
			// // send(embed10);
			// // sendban(embednew)
			sendStaffstats(embednew);
		}
	}

	// update the overall ban counts
	watchdogBans = newWatchdogBans;
	staffBans = newStaffBans;
}, 1300); // 100ms = 0.1s, you can change this to not get rate limited

// login to discord
const token = config('discord.token');
client.login(token).catch(() => {
	console.error('Something went wrong while connecting to Discord.');
});
