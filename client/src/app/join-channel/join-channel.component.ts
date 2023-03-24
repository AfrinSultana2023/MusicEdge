import {Component, OnInit} from '@angular/core';
import {MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {Channel} from '../models';
import {MusicService} from '../music.service';

@Component({
  selector: 'app-join-channel',
  templateUrl: './join-channel.component.html',
  styleUrls: ['./join-channel.component.scss']
})
export class JoinChannelComponent implements OnInit {
  channels: Channel[];

  constructor(
    public dialogRef: MatDialogRef<JoinChannelComponent>, private musicService: MusicService) {
  }

  ngOnInit(): void {
    this.musicService.getChannels().subscribe(channels => this.channels = channels);
  }

  join(id: string) {
    this.musicService.join(id);
    this.dialogRef.close();
  }
}
