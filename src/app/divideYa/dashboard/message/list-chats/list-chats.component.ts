import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GroupChatComponent } from '../../../shared/group-chat/group-chat.component';
import { ChatSharedComponent } from '../../../shared/chat-shared/chat-shared.component';
import { ActivatedRoute } from '@angular/router';
import { SideAdvertisingComponent } from '../../../shared/side-advertising/side-advertising.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-list-chats',
  imports: [
    GroupChatComponent,
    ChatSharedComponent,
    SideAdvertisingComponent,
    MatIcon],
  standalone: true,
  templateUrl: './list-chats.component.html',
  styleUrl: './list-chats.component.scss'
})
export default class ListChatsComponent implements OnInit, OnChanges {


  _routeActivate: ActivatedRoute = inject(ActivatedRoute);
  public setGroupID: string = '';
  public groupChatID: any;

  showGroupList: boolean = false;
  isMobile: boolean = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.groupChatID = this._routeActivate.snapshot.paramMap.get('groupID');
  }


  ngOnInit(): void {
    this.groupChatID = this._routeActivate.snapshot.paramMap.get('groupID');


    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());


  }

  getCodeGroup(groupID: any): void {
    this.setGroupID = groupID;
    this.toggleGroupList();


  }

  closeMenu(): void {
    this.toggleGroupList();
  }

  public closeChat(): void {
    this.setGroupID = '';
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showGroupList = false; // cierra menú lateral si está en escritorio
    }
  }

  toggleGroupList(forceOpen: boolean = false): void {
    console.log('askbjkdasbdsbjk', this.showGroupList)
    this.showGroupList = forceOpen || !this.showGroupList;
  }

}
