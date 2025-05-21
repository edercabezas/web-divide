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


@Component({
  selector: 'app-list-expenses',
  imports: [
    MatCard,
    MatButton,
    MatCheckbox,
    CurrencyPipe,
    FormsModule,
    ButtonBackComponent,
    SpinerComponent
  ],
  standalone: true,
  templateUrl: './list-expenses.component.html',
  styleUrl: './list-expenses.component.scss'
})
export default class ListExpensesComponent implements OnInit {

  private _crud: CrudService = inject(CrudService);
  _routeActivate: ActivatedRoute = inject(ActivatedRoute);
  _general: GeneralService = inject(GeneralService);
  _alert: AlertService = inject(AlertService);
  spinnerShow: boolean = true;
  public dataExpenses: any;
  countMembers: any[] = [];
  numberFinish: number = 0;
  dataStorage: any;
  expenseID: any;
  constructor() {
  }
  ngOnInit(): void {
    this._getUserStorage();
    this.expenseID = this._routeActivate.snapshot.paramMap.get('expenseID');
    this.getExpenses();

  }

  public checkData(data: any) {


    this._crud.updateExpense(data.payGroup, data.colection).then((response: any) => {
      this.getExpenses();
      this._alert.showToasterFull(response.message);
    }).catch((error: any) => console.log(error)
    ).finally(() => console.log('final'));

  }

  getExpenses(): void {

    this._crud.getReadExpense(this.expenseID).then((response: any) => {
      this.dataExpenses = response;
      this.numberFinish = this.dataExpenses.miembrosDetalle.filter((item: any) => item.payGroup === true).length;
    }).catch(() => this.spinnerShow = false)
      .finally(() => {
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



}
