import {CommandMessage, CommandoClient} from "discord.js-commando";
import {Bot} from "../Bot";
import {SafeCommand} from "./SafeCommand";

export class SkipCommand extends SafeCommand {

  public constructor(client: CommandoClient, private bot: Bot) {
    super(client, {
      name: "skip",
        group: "music",
        memberName: "skip",
        description: "Skips a song",
        examples: ["skip"]
    });
  }

  public runSafe(message: CommandMessage, args: any, fromPattern: boolean): Promise<any> | void {
    this.bot.getGuildMusicManager(message.guild).skip();
  }
}
