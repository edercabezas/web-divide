import { Component, inject, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgClass } from '@angular/common';
import { ChatService } from '../../core/services/chat/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../../core/services/general/general.service';

@Component({
  selector: 'app-group-chat',
  imports: [
    MatIcon,
     NgClass
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
     this.returCodeGroup.emit( this.groupChatID);
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

}
