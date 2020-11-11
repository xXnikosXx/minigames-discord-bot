// require config.json for botName
const { botName } = require("../config.json");
module.exports = {
	name: "server-configure",
	description: "Configure the server to make it Minigames-ready! {Automated actions: creates 'player' role, 'minigames' channel *category* and 'minigames' *text* channels (10).}",
	args: false,
	usage: "<custom>",
	guildOnly: true,
	cooldown: 5,
	aliases: ["configure", "config"],
	execute(message, args) {
		if (args[0] == "custom") {
			message.reply("Command Under Development...");
		}
		else if (args[0] != null) {
			message.reply("Invalid arguements. For more info, use \"//help server-configure\".");
		}
		else {

			// edit bot's role color and make it appear seperately on sidebar
			const myRole = message.guild.roles.cache.find(role => role.name === botName);
			myRole.edit({
				color: "#1cd2fe",
				hoist: true,
			})
				.then(mr => {
					const embed_role_complete = new global.Discord.MessageEmbed()
						.setTitle(`Edited role! ${mr}`)
						.setColor("#52dd8d");
					message.channel.send(embed_role_complete);
				},
				)
				.catch(console.error);

			// send message about categry creation.
			const embed_cat_create = new global.Discord.MessageEmbed()
				.setTitle("Creating minigames channel category...")
				.setColor("#52dd8d");
			message.channel.send(embed_cat_create);

			// create the minigames channel category.
			message.guild.channels.create("MINIGAMES!", {
				type: "category",
			})
				.then(c => {
					const embed_cat_complete = new global.Discord.MessageEmbed()
						.setTitle(`Minigames channel *Category* successfully created! {${c}}`)
						.setColor("#52dd8d");
					message.channel.send(embed_cat_complete);
					global.c = c;
				})
				.catch(console.error);

			// send message about channel creation
			const embed_chan_create = new global.Discord.MessageEmbed()
				.setTitle("Creating the minigames text channels (10)...")
				.setColor("#52dd8d");
			message.channel.send(embed_chan_create);

			let playerRole;
			// Create a new role for the players.
			message.guild.roles.create({
				data: {
					name: "Players",
					color: "#188c90",
				},
			})
				.then(pr => {
					// get Players role id for use in channels below
					playerRole = message.guild.roles.cache.find(role => role.name === "Players");
					const embed_role_create = new global.Discord.MessageEmbed()
						.setTitle(`Created minigames player role! [${pr.id}]`)
						.setColor("#52dd8d");
					message.channel.send(embed_role_create);
				})
				.then(pr => {
					console.log(pr);
					// loop for creating the 10 text channels
					for (let i = 1; i < 11; i++) {
						message.guild.channels.create("Minigames " + i, {
							type: "text",
							topic: "A text channel dedicated to playing with the Discord Minigames bot.",
							nsfw: "false",
							permissionOverwrites: [
								{
									// permissions for @Everyone
									id: message.guild.roles.everyone.id,
									deny: [
										"ADD_REACTIONS",
										"VIEW_CHANNEL",
										"SEND_MESSAGES",
										"SEND_TTS_MESSAGES",
										"MANAGE_MESSAGES",
										"ATTACH_FILES",
										"READ_MESSAGE_HISTORY",
										"MANAGE_WEBHOOKS",
										"CREATE_INSTANT_INVITE",
										"MANAGE_CHANNELS",
										"MANAGE_GUILD",
										"EMBED_LINKS",
										"MENTION_EVERYONE",
										"USE_EXTERNAL_EMOJIS",
									],
								},
								{
									// permissions for "player" role
									id: playerRole,
									allow: [
										"ADD_REACTIONS",
										"VIEW_CHANNEL",
										"SEND_MESSAGES",
										"READ_MESSAGE_HISTORY",
									],
								},
							],
						})
							.then(tc => {
								// change channel's parent to the one created above (Minigames)
								tc.setParent(global.c, { lockPermissions: false });

								// emb message about completed channel creating
								const embed_chan_complete = new global.Discord.MessageEmbed()
									.setTitle(`[${i}] Minigames *text* channel successfully created! ${tc}`)
									.setColor("52dd8d");
								message.channel.send(embed_chan_complete);
							})
							.catch(console.error);
					}
				})
				.catch(console.error);
		}
	},
};
