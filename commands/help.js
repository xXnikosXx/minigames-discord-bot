// requiring the prefix because it will be used many times in thsi file/
const { prefix } = require("../config.json");

module.exports = {
	name: "help",
	description: "List all of my commands or info about a specific command.",
	aliases: ["commands"],
	usage: "[command name]",
	cooldown: 5,
	execute(message, args) {
		// determine whether it should display a list of all the command names or only information about a specific command.
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			const title = ("Here's a list of all my commands:");
			const description = data.push(commands.map(command => command.name).join(", "));
			const footer = `You can send ${prefix}help [command name] to get info on a specific command!`;
			const helpEmbed = new global.Discord.MessageEmbed()
				.setColor("RANDOM")
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle(title)
				.setDescription(data)
				.setTimestamp()
				.setFooter(footer);
			return message.author.send(helpEmbed)
				.then(() => {
					if (message.channel.type === "dm") return;
					message.reply("I've sent you a DM with all my commands!");
					console.log(data);
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply("it seems like I can't DM you! Do you have DMs disabled?");
				});
		}

		// send the help message for the command they specified.
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply("that's not a valid command!");
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });


	},
};
