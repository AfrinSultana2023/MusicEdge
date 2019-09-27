import {Guild, VoiceChannel, VoiceConnection} from "discord.js";
import ytdl from "ytdl-core";
import {MusicPlayer} from "./MusicPlayer";
import {TrackScheduler} from "./TrackScheduler";

export class GuildMusicManager {
  private trackScheduler: TrackScheduler;
  private musicPlayer: MusicPlayer;

  constructor(private guild: Guild) {
    this.musicPlayer = new MusicPlayer(this.guild);
    this.trackScheduler = new TrackScheduler(this.musicPlayer);
  }

  public join(channel: VoiceChannel): Promise<VoiceConnection> {
    if (channel == null) {
      throw new Error("You must be in a channel.");
    }
    return channel.join();
  }

  public async playNow(url: string, channel: VoiceChannel): Promise<void> {
    if (this.guild.me.voiceChannel == null) {
      await this.join(channel);
    }
    return ytdl.getBasicInfo(url).then(trackInfo => this.trackScheduler.now(trackInfo));
  }

  public leave() {
    if (this.guild.me.voiceChannel) {
      this.guild.me.voiceChannel.leave();
    }
  }

  public queue(url: string) {
    return ytdl.getBasicInfo(url).then(trackInfo => this.trackScheduler.append(trackInfo));
  }

  public skip() {
    return this.trackScheduler.playNext();
  }
}
