import {Video} from "simple-youtube-api";
import {MusicPlayer} from "./MusicPlayer";
import {PlayerObserver} from "./PlayerObserver";
import {TrackSchedulerObserver} from "./TrackSchedulerObserver";

export class TrackScheduler implements PlayerObserver {

  private tracks: Video[] = [];
  private previousTracks: Video[] = [];
  private currentlyPlaying: Video;
  private observers: TrackSchedulerObserver[] = [];

  constructor(private musicPlayer: MusicPlayer) {
    this.musicPlayer.register(this);
  }

  public playNext() {
    const videoInfo = this.tracks.shift();
    if (videoInfo) {
      if (this.currentlyPlaying) {
        this.previousTracks.unshift(this.currentlyPlaying);
      }
      this.currentlyPlaying = videoInfo;
      this.musicPlayer.play(videoInfo.url);
    } else {
      throw new Error("No track in queue");
    }
  }

  public playPrevious() {
    const videoInfo = this.previousTracks.shift();
    if (videoInfo) {
      if (this.currentlyPlaying) {
        this.tracks.unshift(this.currentlyPlaying);
      }
      this.currentlyPlaying = videoInfo;
      this.musicPlayer.play(videoInfo.url);
    } else {
      throw new Error("No tracks played previously");
    }
  }

  public restart() {
    if (this.currentlyPlaying) {
      this.musicPlayer.play(this.currentlyPlaying.url);
    } else {
      throw new Error("Nothing currently playing");
    }
  }

  public append(track: Video) {
    this.tracks.push(track);
  }

  public next(track: Video) {
    this.tracks.unshift(track);
  }

  public now(track: Video) {
    this.next(track);
    this.playNext();
  }

  public pause() {
    this.musicPlayer.pause();
  }

  public resume() {
    this.musicPlayer.resume();
  }

  public onEnd(reason: string): void {
    console.log(reason);
    if (reason !== "NewSong") {
      if (this.tracks.length > 0) {
        this.playNext();
      } else {
        this.previousTracks.unshift(this.currentlyPlaying);
        this.currentlyPlaying = null;
      }
    }
    this.updateObservers();
  }

  public onError(err: Error): void {
    console.log(err);
    this.onEnd("error");
  }

  public onDebug(information: string): void {
  }

  public onSpeaking(value: boolean): void {
  }

  public onStart(): void {
    this.updateObservers();
  }

  public onVolumeChange(oldVolume: number, newVolume: number): void {
  }

  public register(observer: TrackSchedulerObserver) {
    this.observers.push(observer);
  }

  public getCurrentlyPlaying(): Video {
    return this.currentlyPlaying;
  }

  public deregister(observer: TrackSchedulerObserver) {
    this.observers.splice(this.observers.indexOf(observer), 1);
  }

  public isPaused() {
    return this.musicPlayer.isPaused();
  }

  private updateObservers() {
    for (const observer of this.observers) {
      observer.onChange(this.currentlyPlaying, this);
    }
  }
}
