import {videoInfo} from "ytdl-core";
import {MusicPlayer} from "./MusicPlayer";
import {PlayerObserver} from "./PlayerObserver";

export class TrackScheduler implements PlayerObserver {

  private tracks: videoInfo[] = [];

  constructor(private musicPlayer: MusicPlayer) {
  }

  public playNext() {
    this.musicPlayer.play(this.tracks.shift().video_url);
  }

  public append(track: videoInfo) {
    this.tracks.push(track);
  }

  public next(track: videoInfo) {
    this.tracks.unshift(track);
  }

  public now(track: videoInfo) {
    this.next(track);
    this.playNext();
  }

  public onDebug(information: string): void {
  }

  public onEnd(reason: string): void {
    this.playNext();
  }

  public onError(err: Error): void {
  }

  public onSpeaking(value: boolean): void {
  }

  public onStart(): void {
  }

  public onVolumeChange(oldVolume: number, newVolume: number): void {
  }
}
