import { Component, inject, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgClass } from '@angular/common';
import { ChatService } from '../../core/services/chat/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../../core/services/general/general.service';
import { AddGroupComponent } from '../add-group/add-group.component';
import { AddNewPeopleComponent } from '../add-new-people/add-new-people.component';
import { MatDialog } from '@angular/material/dialog';
import { PremiumPlansDialogComponent } from '../premium-plans-dialog/premium-plans-dialog.component';
import { GroupService } from '../../core/services/group/group.service';
import { OptionAdvertisementComponent } from '../option-advertisement/option-advertisement.component';

@Component({
  selector: 'app-group-chat',
  imports: [
    MatIcon,
    NgClass,
    AddGroupComponent
  ],
  standalone: true,
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss',
  providers: [DatePipe]
})
export class GroupChatComponent implements OnInit, OnChanges {


  private _general: GeneralService = inject(GeneralService);
  private _chat: ChatService = inject(ChatService);
  private _route: Router = inject(Router);
  _routeActivate: ActivatedRoute = inject(ActivatedRoute);
  _groupService: GroupService = inject(GroupService);
  dialog: MatDialog = inject(MatDialog);
  @Output() returCodeGroup = new EventEmitter<any>();
  @Output() closeCodeGroup = new EventEmitter<any>();

  dataGroupList: any[] = [];
  dataStorage: any;
  groupList: any;
  groupChatID: any;
  spinnerShow: boolean = false;
  countRegisterAdd: number = 0;
  countRegisterAddPeople: string = '';
  addUser: number = 0;


  constructor() { }


  ngOnChanges(changes: SimpleChanges): void {
    this.groupChatID = this._routeActivate.snapshot.paramMap.get('groupID');
    console.log(this.groupChatID)
  }



  ngOnInit(): void {
    this.groupChatID = this._routeActivate.snapshot.paramMap.get('groupID');
    this.returCodeGroup.emit(this.groupChatID);
    this._getUserStorage();
  }


  getGroup(): void {
    console.log(this.dataStorage?.userID)
    this._chat.readGroup(this.dataStorage?.userID).then((response: any) => {
      this.dataGroupList = response;
    }).catch(() => this.spinnerShow = false)
      .finally(() => {
        this.spinnerShow = false
      });
  }


  private _getUserStorage(): any {
    this.dataStorage = this._general.getStorage();
    this.getGroup();
  }

  public createRouter(group: string): void {
    // console.log(group)
    this.groupChatID = group;
    this.returCodeGroup.emit(group);
    this._route.navigate(['dashboard/chats', group]).then();
  }

  closeMenu(): void {
    this.closeCodeGroup.emit();
  }

  modalAnuncioGroup(): void {
    const dialogRef = this.dialog.open(OptionAdvertisementComponent, {
      width: '400px',
       height: '250px',
      disableClose: true,
      data: 'Has alcanzado el límite permitido para realizar esta accion. Para seguir disfrutando, puedes ver anuncios.'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.countRegisterAdd = 0;
        this.countGroupCreate();
      }
    });
  }


  openUserSearchDialog(): void {

    if (this.countRegisterAdd > this.addUser) {
      this.modalAnuncioGroup();
      return;
    }


    const dialogRef = this.dialog.open(AddNewPeopleComponent, {
      width: '400px',
      height: '250px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.groupChatID = result;
        this._route.navigate(['dashboard/chats', result]).then();
        this.getGroup();
        // Usuario seleccionado para agregar y chatear
        console.log('Usuario seleccionado:', result);
      }
    });
  }

  openPremiumDialog() {
    const dialogRef = this.dialog.open(PremiumPlansDialogComponent, {
      width: '95%',
      maxWidth: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((selectedPlan) => {
      if (selectedPlan) {
        console.log('Plan seleccionado:', selectedPlan);
        // Aquí haces la lógica de pago o anuncio según el plan
      }
    });
  }

  getConfiguration(): void {
    this._general.getGroupChat().then((response: any) => {

      console.log(response)
      this.fiterMyOption(response);
    }).catch(() => this.spinnerShow = false)
      .finally(() => {
        this.spinnerShow = false
      });
  }

  fiterMyOption(data: any): void {

    const AddUser = data.filter((item: any) => item.module === 'Add-user');
    this.addUser = AddUser[0]?.value;
  }

  updateCreateRegister(): void {
    if (this.countRegisterAdd) {
      this.countGroupUpdate();
      return;
    }
    this.countGroupCreate();
  }

  countGroupCreate(): void {

    console.log(this.countRegisterAdd)
    const data = {
      userID: this.dataStorage.userID,
      muduloName: 'Add-user',
      amountRegister: this.countRegisterAdd ? this.countRegisterAdd + 1 : 1,
      groupMessaID: this._general.generateId()
    };
    this._groupService.countGroupMessageCreate(data).then((response: any) => {

    });
  }

  countGroupUpdate(): void {
    const registerNumber = this.countRegisterAdd ? this.countRegisterAdd + 1 : 1;
    this._groupService.updateCountRegister(registerNumber, this.countRegisterAddPeople).then((response: any) => {
      this.getCountGroup();
    })
  }


  getCountGroup(): void {
    this._groupService.readGroupMessage(this.dataStorage.userID, 'Add-user',).then((response: any) => {
      this.countRegisterAdd = response?.groupDoc?.amountRegister;
      this.countRegisterAddPeople = response?.groupId;
    })
  }

}
