import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-premium-plans-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './premium-plans-dialog.component.html',
  styleUrl: './premium-plans-dialog.component.scss'
})
export class PremiumPlansDialogComponent {

  readonly dialogRef = inject(MatDialogRef<PremiumPlansDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  selectPlan(plan: string) {
    this.dialogRef.close(plan); // Retorna el plan seleccionado
  }

   onNoClick(): void {
    this.dialogRef.close(null);
  }
}
