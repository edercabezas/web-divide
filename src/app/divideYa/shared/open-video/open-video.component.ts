import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-open-video',
  imports: [
  ],
  templateUrl: './open-video.component.html',
  styleUrl: './open-video.component.scss'
})
export class OpenVideoComponent {

 constructor(
    public dialogRef: MatDialogRef<OpenVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  claimPoints() {
    // lógica para sumar puntos al usuario
    console.log('Puntos reclamados');
    this.dialogRef.close();
  }
}