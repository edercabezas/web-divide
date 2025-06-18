import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OpenVideoComponent } from '../../shared/open-video/open-video.component';
import { MatListModule } from '@angular/material/list';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-reward',
  imports: [
    MatListModule,
    ScrollingModule,
    MatDialogModule,
  ],
  templateUrl: './reward.component.html',
  styleUrl: './reward.component.scss'
})
export class RewardComponent {
 videos = [
    { 
      title: 'Gana puntos con este video', 
      description: 'Video promocional 1', 
      thumbnail: 'assets/video1.jpg', 
      url: 'https://path.to/video1.mp4',
      points: 20 
    },
    { 
      title: '¡Ofertas increíbles!', 
      description: 'Descuento limitado', 
      thumbnail: 'assets/video2.jpg', 
      url: 'https://path.to/video2.mp4',
      points: 20 
    },
    { 
      title: 'Descubre esta app', 
      description: 'Conoce más', 
      thumbnail: 'assets/video3.jpg', 
      url: 'https://path.to/video3.mp4',
      points: 20 
    },
      { 
      title: 'Gana puntos con este video', 
      description: 'Video promocional 1', 
      thumbnail: 'assets/video1.jpg', 
      url: 'https://path.to/video1.mp4',
      points: 20 
    },
    { 
      title: '¡Ofertas increíbles!', 
      description: 'Descuento limitado', 
      thumbnail: 'assets/video2.jpg', 
      url: 'https://path.to/video2.mp4',
      points: 20 
    },
    { 
      title: 'Descubre esta app', 
      description: 'Conoce más', 
      thumbnail: 'assets/video3.jpg', 
      url: 'https://path.to/video3.mp4',
      points: 20 
    },
    { 
      title: 'Descubre esta app', 
      description: 'Conoce más', 
      thumbnail: 'assets/video3.jpg', 
      url: 'https://path.to/video3.mp4',
      points: 20 
    },
      { 
      title: 'Gana puntos con este video', 
      description: 'Video promocional 1', 
      thumbnail: 'assets/video1.jpg', 
      url: 'https://path.to/video1.mp4',
      points: 20 
    },
    { 
      title: '¡Ofertas increíbles!', 
      description: 'Descuento limitado', 
      thumbnail: 'assets/video2.jpg', 
      url: 'https://path.to/video2.mp4',
      points: 20 
    },
    { 
      title: 'Descubre esta app', 
      description: 'Conoce más', 
      thumbnail: 'assets/video3.jpg', 
      url: 'https://path.to/video3.mp4',
      points: 20 
    }
  ];

  constructor(private dialog: MatDialog) {}

  openVideoModal(video: any) {
    this.dialog.open(OpenVideoComponent, {
      data: video,
      width: '95%',
      maxWidth: '400px',
    });
  }

  openVideo(video: any) {
  this.dialog.open(OpenVideoComponent, {
    data: video,
    panelClass: 'custom-video-modal',
  });
}

}
