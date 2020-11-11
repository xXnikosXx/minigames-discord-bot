module.exports = {
	name: "minesweeper",
	description: "Minesweeper minigame right here, inside of Discord! =D",
	args: false,
	usage: " ",
	guildOnly: true,
	cooldown: 5,
	aliases: ["msp"],
	execute(message) {
		message.channel.send(
			".....1    2    3   4    5    6   7    8    9   10\n" +
			"a :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:\n" +
			"b :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:\n" +
			"c :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:\n" +
			"d :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:\n" +
			"e :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:\n" +
			"f  :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:\n" +
			"g :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:\n" +
			"h :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:\n" +
			"i  :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:\n" +
			"j  :red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle::red_circle:",
		);

		const embed = new global.Discord.MessageEmbed()
			.setTitle("Creating minigames channel category...")
			.addField("text", "Emojii Explanation:\n :red_circle: => unchecked field\n :boom: => mine\n :flag_white: => flagged field\n :one: ,:two:, :three:etc. => number of mines near tile.")
			.setColor("#5f52dd");
		message.channel.send(embed);
	},
};
