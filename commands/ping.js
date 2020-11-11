module.exports = {
	name: "ping",
	description: "Ping!",
	args: false,
	usage: " ",
	guildOnly: false,
	cooldown: 5,
	aliases: ["latency"],
	execute(message) {
		// It sends the user "Pinging"
		message.channel.send("Pinging...").then(m =>{
			// The math thingy to calculate the user's ping
			const ping = m.createdTimestamp - message.createdTimestamp;
			// change embed's color depending on ping
			let color = "#000000";
			if (ping <= 100) {
				color = "#4add4b";
			}
			else if (ping <= 400) {
				color = "#6013c2";
			}
			else if (ping <= 900) {
				color = "#dde02c";
			}
			else {
				color = "#e21b1b";
			}
			// Basic embed
			const embed = new global.Discord.MessageEmbed()
				.setAuthor(`Your ping is ${ping}ms`)
				.setColor(color);

			// Then It Edits the message with the ping variable embed that you created
			m.edit(embed);
		});
	},
};
