// node.js for filesystem
const fs = require("fs");
// require Discord.js module
const Discord = require("discord.js");
global.Discord = Discord;
// grab attributes from config.json
const { prefix } = require("./config.json");
// grab token value - located in individual file for safety (prevention from accidental uploading/sharing)
const { token } = require("./token.json");

// create a new discord client
const client = new Discord.Client();
global.client = client;
client.commands = new Discord.Collection();

// locate command files within nested "commands" folder (command files must end with .js ext)
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// for comand cooldowns.
const cooldowns = new Discord.Collection();


// once bot is online
client.once("ready", () => {
	console.log("Ready!");
	// set activity as: (PLAYING / STREAMING / LISTENING / WATCHING)
	client.user.setActivity("minigames =D !", { type: "PLAYING" });
	//  set status as: (online / idle / invisible / dnd)
	client.user.setStatus("online");
	// DM specified user that bot's ready
	client.users.fetch("287988318455726081").then((user) => {
		user.send("Bot's Up!");
	});
});

// once the bot receives a message (either in DMs or in a server channel it has access to)
client.on("message", message => {
	// ignore the message if it's sent by a bot or if it doesnt start with the prefix (specified with "prefix" in config.json file)
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// using .split() to split the command arguements. .split(/ +/) instead of .split(" ") in case user adds more than one space between arguements.
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	// takes the first element in array and returns it while also removing it from the original array (so that we don't have the command name string inside the args array)
	const commandName = args.shift().toLowerCase();

	/*	If there isn't a command with that name, exit early.
	If there is, .get() the command and call its .execute() method while passing in your message and args variables as the method arguments.
	In case something goes wrong, log the error and report back to the member to let them know.	*/
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// check if command isguild-only or if it can be used in dms as well.
	if (command.guildOnly && message.channel.type === "dm") {
		return message.reply("I can't execute that command inside DMs!");
	}


	/* return error to user if commands aren't specified to command that requires arguements.
				check if the usageproperty exists (and is truthy) in the command file. */
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// configuring cooldown when necessary
	// You check if the cooldowns Collection has the command set in it yet. If not, then add it in.
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	// A variable with the current timestamp.
	const now = Date.now();
	// A variable that .get()s the Collection for the triggered command.
	const timestamps = cooldowns.get(command.name);
	// A variable that gets the necessary cooldown amount. If you don't supply it in your command file, it'll default to 3. Afterwards, convert it to the proper amount of milliseconds.
	const cooldownAmount = (command.cooldown || 3) * 1000;

	// check if the timestamps Collection has the author ID in it yet.
	if (timestamps.has(message.author.id)) {
		// .get() the authorID and then sum it up with the cooldownAmount variable, in order to get the correct expiration timestamp.
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		// If the expirationTime has not passed, you return a message letting the user know how much time is left until they can use that command again.
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}

		//  if the timestamps Collection doesn't have the message author's ID (or if the author ID did not get deleted as planned),
		// .set() the author ID with the current timestamp and create a setTimeout() to automatically delete it after the cooldown period has passed:
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}


	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply("there was an error trying to execute that command!");
	}
});

client.login(token);
