import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-option-advertisement',
  imports: [
    MatDialogModule
  ],
  standalone: true,
  templateUrl: './option-advertisement.component.html',
  styleUrl: './option-advertisement.component.scss'
})
export class OptionAdvertisementComponent {

  
  readonly dialogRef = inject(MatDialogRef<OptionAdvertisementComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  
  
  verAnuncio(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

}
