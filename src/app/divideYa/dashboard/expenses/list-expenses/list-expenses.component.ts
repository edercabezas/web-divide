import { Component, inject, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { CrudService } from '../../../core/services/crud/crud.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonBackComponent } from '../../../shared/button-back/button-back.component';
import { SpinerComponent } from '../../../shared/spiner/spiner.component';
import { AlertService } from '../../../core/services/alert/alert.service';
import { GeneralService } from '../../../core/services/general/general.service';
import { GroupService } from '../../../core/services/group/group.service';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { HistoryExpensesComponent } from '../../../shared/history-expenses/history-expenses.component';
import { MatDialog } from '@angular/material/dialog';
import { serverTimestamp } from 'firebase/firestore';


@Component({
  selector: 'app-list-expenses',
  imports: [
    MatCard,
    MatButton,
    MatCheckbox,
    CurrencyPipe,
    FormsModule,
    ButtonBackComponent,
    SpinerComponent,
    MatIcon,
    MatFormField,
    MatInput
  ],
  standalone: true,
  templateUrl: './list-expenses.component.html',
  styleUrl: './list-expenses.component.scss'
})
export default class ListExpensesComponent implements OnInit {

  private _crud: CrudService = inject(CrudService);
  _groupService: GroupService = inject(GroupService);
  _routeActivate: ActivatedRoute = inject(ActivatedRoute);
  _general: GeneralService = inject(GeneralService);
  _alert: AlertService = inject(AlertService);
   dialog: MatDialog = inject(MatDialog);

  spinnerShow: boolean = true;
  public dataExpenses: any;
  countMembers: any[] = [];
  numberFinish: number = 0;
  dataStorage: any;
  expenseID: any;
  inputExpense: string = '';
  inputValue: number = 0;
  newExpenses: number = 0;

  expensesData: any[] = [];

  constructor() {
  }
  ngOnInit(): void {
    this._getUserStorage();
    this.expenseID = this._routeActivate.snapshot.paramMap.get('expenseID');
    this.getExpenses();

  }

  public checkData(data: any) {
    this._groupService.updateExpense(data.payGroup, data.colection).then((response: any) => {
      this.getExpenses();
      this._alert.showToasterFull(response.message);
    }).catch((error: any) => console.log(error)
    ).finally(() => {

      if (data?.paygroup) {
        this.createNotification(`El administrador indica que, ${data?.userName} esta pendiente de pago`, 'pay-group');
      } else {
        this.createNotification(`El administrador indica que, ${data?.userName} esta al dia con su obligación`, 'pay-group');

      }
      console.log('final')
    });

  }

  getExpenses(): void {

    this._groupService.getReadExpense(this.expenseID).then((response: any) => {
      console.log(response)
      this.dataExpenses = response;
      this.numberFinish = this.dataExpenses.miembrosDetalle.filter((item: any) => item.payGroup === true).length;
    }).catch(() => this.spinnerShow = false)
      .finally(() => {
        this.getExpensesData();
        this.spinnerShow = false
      });
  }

  private _getUserStorage(): any {
    this.dataStorage = this._general.getStorage();
    console.log(this.dataStorage)
  }
  public shareGroup(group: any): void {
    this._general.sharedLink(group)
  }


  public closeGroup(): void {
    const statusGroup = !this.dataExpenses.status;
    console.log(statusGroup);
    this._groupService.closeOrOpenGroup(statusGroup, this.dataExpenses.uid).then((response: any) => {
      if (response.statu) {
        this._alert.showToasterFull(response.message);
      } else {
        this._alert.showToasterError(response.message);
      }
    }).finally(() => {
      this.getExpenses();

      if (this.dataExpenses.status) {
        this.createNotification('Acaba de cerrar el grup', 'close-group')
      } else {
        this.createNotification('Acaba de Reabrir el grupo', 'close-group')
      }
    });
  }

  createNotification(message: string, typeNotification: string): void {
    const data = {
      groupID: this.dataExpenses.uid,
      groupName: this.dataExpenses?.name,
      userID: this._general.getStorage()?.userID,
      userName: this._general.getStorage()?.userName,
      typeNotification: typeNotification,
      message: message,
      status: false,
      colorNotification: '#158b54',
      iconNotification: 'expense'
    };
    this._general.createNotificationGeneral(data, '/notification').then((response: any) => {
      console.log(response);
    });
  }

  public addExpense(): void {

    if (this.inputExpense?.trim() === '' || this.inputValue === 0) {
      this._alert.showToasterWarning('Debes diligenciar ambos campos');
      return;
    }
    const data: any = {
      expenseID: this._general.generateId(),
      inputExpense: this.inputExpense,
      inputValue: this.inputValue,
      userID: this._general.getStorage()?.userID,
      userName: this._general.getStorage()?.userName,
      timestamp: serverTimestamp(),
      groupID: this.dataExpenses.uid
    }

    this._groupService.createExpense(data).then((response: any) => {
      console.log(response)
      if (response.status) {
        this._alert.showToasterFull(response.message);
      } else {
        this._alert.showToasterError(response.message);
      }
    }).finally(() => {
      this.getExpensesData();
      this.inputExpense = '';
      this.inputValue = 0;
    })

    this.expensesData.push(data);

  }

  getExpensesData(): void {
    this._groupService.getExpenses(this.dataExpenses?.uid).then((response: any) => {
      this.expensesData = response;
      console.log(response)
    }).finally(() => this.returValueExpenses());
  }

  deleteItem(value: number, data: any): void {
    this._groupService.removeExpense(data.id).then((response: any) => {
      if (response.status) {
        this._alert.showToasterFull(response.message);
      } else {
        this._alert.showToasterError(response.message);
      }
    }).finally(() => this.getExpensesData())
  }

  returValueExpenses(): void {

  this.newExpenses = this.expensesData 
  .map(expen => +expen.inputValue) // Extrae solo el campo `valor`
  .reduce((acc, curr) => acc + curr, 0);
  }


  
    openModalHistory(): void {
      const dialogRef = this.dialog.open(HistoryExpensesComponent, {
        width: '400px',
        disableClose: true,
       data: {
      groupName: this.dataExpenses?.name,
      initialAmount: +this.dataExpenses?.totalAmount,
      totalValue: (+this.dataExpenses?.totalAmount) + (+this.newExpenses),
      expenses: this.expensesData
    }
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log(result)
          // Aquí puedes redirigir a un video o mostrar el anuncio
          // this.irAVerElAnuncio();
        }
      });
    }

}
