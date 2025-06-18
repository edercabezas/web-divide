import {Component, inject, Input, OnInit} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../core/services/crud/crud.service';
import {AuthService} from '../core/services/suth/auth.service';;
import {MatDialog} from '@angular/material/dialog';
import { AlertService } from '../core/services/alert/alert.service';
import { GeneralService } from '../core/services/general/general.service';
import { SpinerComponent } from "../shared/spiner/spiner.component";

@Component({
  selector: 'app-guest',
  imports: [
    MatCard,
    CurrencyPipe,
    MatButton,
    MatIcon,
    SpinerComponent
],
  standalone: true,
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.scss',
  providers: [DatePipe]
})
export default class GuestComponent implements OnInit{



  _routeActivate: ActivatedRoute =  inject(ActivatedRoute);
  _crud: CrudService =  inject(CrudService);
  _auth: AuthService =  inject(AuthService);
  _alert: AlertService =  inject(AlertService);
  _route: Router = inject(Router);
  _general: GeneralService = inject(GeneralService);
  _datePipe: DatePipe = inject(DatePipe);
  dialog: MatDialog = inject(MatDialog);
  guestData: any;
  isAuthenticated: boolean = false;
  spinnerShow: boolean = false;
  dataStorage: any;
  constructor() {


  }

  async ngOnInit() {

    this._getUserStorage();
    const token: any = this._routeActivate.snapshot.paramMap.get('token');

    console.log(token)

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }



    this.isAuthenticated = this._auth.isAuthenticatedStorage(); // cambia esto según tu lógica


    if (!this.isAuthenticated) {

      // this.openDialogInfo();
    } else {
      setTimeout(() => {
        this.readGroupGuest(token);
      }, 500)

    }

  }

  returDashboard(): void {
    this._route.navigate(['/dashboard']).then();
  }

  readGroupGuest(token: any): void {
     this.spinnerShow = true;
    if (typeof window !== 'undefined') {
     const data = localStorage.getItem('token');


      console.log(token)
      this._crud.readGroupGuest(token, this.dataStorage?.userID).then((response: any) => {
        console.log(response)
        this.guestData = response;
      }).finally(() => {
        this.spinnerShow = false;
      })

    }

  }

  private _getUserStorage(): any {
    this.dataStorage = this._general.getStorage();
    console.log(this.dataStorage)
  }

  login(): void {
     this._route.navigate(['/'])
  }

    memberDashboard(): void {
     this._route.navigate(['dashboard/mis-grupos'])
  }
  

  registerNewMember(statu: boolean): void {

    const dateNow = new Date();
    const myDate: any = this._datePipe.transform(dateNow, 'dd-MM-yyyy');

    const data: any = {
      groupId: this.guestData?.groupID,
      userId: this.dataStorage?.userID,
      role: 'Invitado',
      joinedAt: myDate,
      token: this.guestData?.token,
      memberID: this._general?.generateId(),
      status: statu,
      payGroup: false,
    };
    this._crud.registerMembersGuest(data).then((response: any) => {
      console.log(response);
      if (response) {
        this._addGroup();
      }
    }).catch(() => {
          this._alert.showToasterError('Hubo un error al realzar la accion intentelo mas tarde')
    });
  }

    noMemberGroup(): void {
      this._alert.showToasterUpdate('Puedes crear grupos agregar tus amigos y interactuar con ellos');
      this.createNotification('Acaba de aceptar la invitacion al grupo')
      this._route.navigate(['dashboard'])
    }

  private _addGroup(): void {
    localStorage.removeItem('token');
      this.createNotification('Acaba de rechazar la invitacion al grupo')
      this._alert.showToasterFull('Ya eres parte del grupo puedes intercambair mensajes con los integrantes');
      this._route.navigate(['dashboard/mis-grupos'])
  }


  
  createNotification(message: string): void {
    const data = {
      // groupID: this.dataExpenses.uid,
      groupName: this.guestData?.nombreGrupo,
      userID: this._general.getStorage()?.userID,
      userName: this._general.getStorage()?.userName,
      typeNotification: 'enter-group',
      message: message,
      status: false,
      colorNotification: '#158b54',
      iconNotification: 'expense'
    };
    this._general.createNotificationGeneral(data, '/notification').then((response: any) => {
      console.log(response);
    });
  }

}
