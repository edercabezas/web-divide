import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ChatService } from '../../core/services/chat/chat.service';
import { GeneralService } from '../../core/services/general/general.service';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../core/services/alert/alert.service';

@Component({
  selector: 'app-add-new-people',
  imports: [
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    FormsModule
  ],
  templateUrl: './add-new-people.component.html',
  styleUrl: './add-new-people.component.scss',
  providers: [DatePipe]
})
export class AddNewPeopleComponent implements OnInit {


  _chat: ChatService = inject(ChatService);
  _general: GeneralService = inject(GeneralService);
  _datePipe: DatePipe = inject(DatePipe);
  _alert: AlertService = inject(AlertService);

  people: string = '';
  usersFound: any[] = [];
  isSearching = false;
  searchPerformed = false;
  dataStorage: any;
  getUserSearch: any;

  constructor(
    public dialogRef: MatDialogRef<AddNewPeopleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  ngOnInit(): void {
    this._getUserStorage();
  }


  agregarYChatear(user: any) {
    // Lógica para agregar usuario e iniciar chat
    console.log('Agregando a:', user);

    // this.dialogRef.close(user);
    const dateNow = new Date();
    const myDate = this._datePipe.transform(dateNow, 'dd-MM-yyyy');

    const groupData: any = {
      group: this._general.getStorage()?.userSecret + ' - ' + user?.userSecret,
      description: 'N/A',
      totalAmount: 0,
      privilege: false,
      createdAt: myDate,
      createdBy: this.dataStorage.userID,
      inviteToken: this._general.generarToken(),
      groupID: this._general.generateId(),
      status: true,
      type: 'Chat'
    };

    this._chat.createdGroupChat('/group', groupData).then((response: any) => {
      console.log('sakbdkasjbdajsdbjabsdbkjas', response);
      this.addFriend(user, response);
    })
  }

  addFriend(data: any, group: any): void {
    const dateNow = new Date();
    const myDate = this._datePipe.transform(dateNow, 'dd-MM-yyyy');
    const item: any = {
      groupId: group?.groupId,
      userId: data?.userID,
      role: 'Admin',
      joinedAt: myDate,
      token: group?.inviteToken,
      memberID: 2,
      status: true,
      payGroup: false
    }

    console.log(item);

    this._chat.registerFriend(item).then((response: any) => {
      console.log(response);
      this._alert.showToasterFull('Se ya puedes hablar con: ' + data?.userName);

      setTimeout(()=> {
        this.cancelar(group?.groupId);
      }, 300)
    });
  }

  cancelar(group: any) {
    this.dialogRef.close(group);
  }

  searchUser(): void {
    console.log('askbaksbdbkasbd')
    if (this.people.trim().length === 0) {
      return;
    }
    const user = this.people.toLocaleLowerCase();
    this._chat.searchUser(user).then((response: any) => {
      console.log(response);
      this.getUserSearch = response;
    })
  }

  private _getUserStorage(): any {
    this.dataStorage = this._general.getStorage();

  }


}