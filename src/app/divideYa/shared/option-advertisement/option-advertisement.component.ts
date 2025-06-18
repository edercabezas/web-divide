import { Component, inject, OnInit } from '@angular/core';
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
export class OptionAdvertisementComponent implements OnInit{

    
  readonly dialogRef = inject(MatDialogRef<OptionAdvertisementComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  


  ngOnInit(): void {
    console.log(this.data);
  }


  
  verAnuncio(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

}
