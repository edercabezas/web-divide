import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-history-expenses',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './history-expenses.component.html',
  styleUrl: './history-expenses.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "es-ES" }],
})
export class HistoryExpensesComponent {

  constructor(
    public dialogRef: MatDialogRef<HistoryExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      groupName: string;
      initialAmount: number;
      totalValue: number;
      expenses: { inputExpense: string; inputValue: number; timestamp: string; userName: string }[];
    }
  ) {}


  
  returDate(timestamp: any): Date {
    return timestamp?.toDate?.() || null;
  }

}

