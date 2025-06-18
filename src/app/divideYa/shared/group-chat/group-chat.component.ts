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
  dialog: MatDialog = inject(MatDialog);
  @Output() returCodeGroup = new EventEmitter<any>();
  @Output() closeCodeGroup = new EventEmitter<any>();

  dataGroupList: any[] = [];
  dataStorage: any;
  groupList: any;
  groupChatID: any;
  spinnerShow: boolean = false;


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


  openUserSearchDialog(): void {

    // this.openPremiumDialog();
    // return;
    //Validacion para premium solo si es premiun sino muestra otro modal

    const dialogRef = this.dialog.open(AddNewPeopleComponent, {
      width: '400px'
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
    
  }
