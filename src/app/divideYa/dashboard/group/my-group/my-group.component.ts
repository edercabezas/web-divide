import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { AddGroupComponent } from '../../../shared/add-group/add-group.component';
import { CrudService } from '../../../core/services/crud/crud.service';
import { ModalCreateGroupComponent } from '../../../shared/modal-create-group/modal-create-group.component';
import { Router } from '@angular/router';
import { SpinerComponent } from '../../../shared/spiner/spiner.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../core/services/general/general.service';
import { GroupService } from '../../../core/services/group/group.service';
import { OptionAdvertisementComponent } from '../../../shared/option-advertisement/option-advertisement.component';


@Component({
  selector: 'app-my-group',
  imports: [
    MatButton,
    MatIcon,
    AddGroupComponent,
    MatCard,
    CurrencyPipe,
    SpinerComponent,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel
  ],
  standalone: true,
  templateUrl: './my-group.component.html',
  styleUrl: './my-group.component.scss',
  providers: [DatePipe],
})
export default class MyGroupComponent implements OnInit {
  dialog: MatDialog = inject(MatDialog);
  _groupService: GroupService = inject(GroupService);
  _general: GeneralService = inject(GeneralService);
  _datePipe: DatePipe = inject(DatePipe);
  private _route: Router = inject(Router);
  spinnerShow: boolean = true;
  dataStorage: any;
  groupList: any[];
  dataFilter: string = '';
  countRegisterGroup: number = 0;
  colectionRegisterGroup: string = '';

  constructor() {
    this.groupList = []
  }

  ngOnInit(): void {
    this._getUserStorage();

  }



  openDialogPass(): void {
    if (this.countRegisterGroup >= 2) {
        this.modalAnuncioGroup();
        return;
    }

    const dialogRef = this.dialog.open(ModalCreateGroupComponent, {
      height: '440px',
      width: '430px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        this.countGroupCreate();
        this.setGroup(result)
      } else {
        console.log('askjdkajdbasdkdjsakjads')
      }
    });


  }
  setGroup(data: any): void {
    const dateNow = new Date();
    const myDate = this._datePipe.transform(dateNow, 'dd-MM-yyyy');

    const groupData: any = {
      group: data.group,
      description: data.description,
      totalAmount: data.value,
      privilege: data.privilege,
      createdAt: myDate,
      createdBy: this.dataStorage.userID,
      inviteToken: this._general.generarToken(),
      groupID: this._general.generateId(),
      status: true
    };

    this._groupService.createdGroup('/group', groupData).then((response: any) => {
      console.log(response);
      this.getGroup();
    })

    console.log(groupData);

  }

  getGroup(): void {
    this._groupService.readGroup(this.dataStorage?.userID).then((response: any) => {
      console.log(response)
      this.spinnerShow = false
      this.groupList = response;
    }).catch(() => this.spinnerShow = false)
      .finally(() => {
        this.spinnerShow = false
      });
  }

  private _getUserStorage(): any {
    this.dataStorage = this._general.getStorage();
    this.getCountGroup();
    this.getGroup();
  }


  public shareGroup(group: any): void {
    this._general.sharedLink(group)
  }

  public showExpense(data: any): void {
    console.log(data)
    this._route.navigate(['dashboard/gasto', data.groupID]).then();
  }

  public showChat(data: any): void {
    console.log(data)
    this._route.navigate(['dashboard/chats', data.id]).then();
    // this._route.navigate(['dashboard/chat', data.id]).then();
  }

  filterDataGroup(): void {
    console.log(this.dataFilter.length)
    if (this.dataFilter && this.dataFilter.length > 2) {
      this.dataFilter = this.dataFilter.toLowerCase();
      this.groupList = this.groupList.filter(item => item.name.toLowerCase().includes(this.dataFilter));
      console.log(this.groupList);
    } else {
      this.getGroup();
    }
  }

  getCountGroup(): void {
    this._groupService.readGroupMessage(this.dataStorage.userID, 'Group').then((response) => {
      console.log(response);
      this.countRegisterGroup = response?.groupDoc?.amountRegister;
      this.colectionRegisterGroup = response?.groupDoc?.groupId;
    })
  }

  updateCreateRegister(): void {

    console.log('a,mmasd', this.countRegisterGroup);
    if(this.countRegisterGroup) {
      console.log('a,mmasd', this.countRegisterGroup);
      this.countGroupUpdate();
      return;
    }
console.log('a,mmasd', this.countRegisterGroup);
    this.countGroupCreate();
  }

  countGroupCreate(): void {
    const data = {
      userID: this.dataStorage.userID,
      muduloName: 'Group',
      amountRegister: this.countRegisterGroup ? this.countRegisterGroup + 1 : 1,
      groupMessaID: this._general.generateId()
    };
    this._groupService.countGroupMessageCreate(data).then((response: any) => {
      console.log(response);
      this.getCountGroup();
    });
  }

  countGroupUpdate(): void {
    const registerNumber = this.countRegisterGroup ? this.countRegisterGroup + 1 : 1;
    this._groupService.updateCountRegister(registerNumber, this.colectionRegisterGroup).then((response: any) => {
      console.log(response);
      this.getCountGroup();
    })
  }

  modalAnuncioGroup(): void {
    const dialogRef = this.dialog.open(OptionAdvertisementComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        // Aquí puedes redirigir a un video o mostrar el anuncio
        // this.irAVerElAnuncio();
      }
    });
  }
}
