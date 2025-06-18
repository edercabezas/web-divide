import { AfterViewInit, ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GroupChatComponent } from '../../../shared/group-chat/group-chat.component';
import { ChatSharedComponent } from '../../../shared/chat-shared/chat-shared.component';
import { ActivatedRoute } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { GoogleAdsenseComponent } from '../../../shared/google-adsense/google-adsense.component';

@Component({
  selector: 'app-list-chats',
  imports: [
    GroupChatComponent,
    ChatSharedComponent,
    GoogleAdsenseComponent,
],
  standalone: true,
  templateUrl: './list-chats.component.html',
  styleUrl: './list-chats.component.scss'
})
export default class ListChatsComponent implements OnInit, OnChanges, AfterViewInit  {


  _routeActivate: ActivatedRoute = inject(ActivatedRoute);
  public setGroupID: string = '';
  public groupChatID: any;

  showGroupList: boolean = false;
  isMobile: boolean = false;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.groupChatID = this._routeActivate.snapshot.paramMap.get('groupID');
     console.log('assasasdsdsds', this.groupChatID)
    
  }


  ngOnInit(): void {
    this.groupChatID = this._routeActivate.snapshot.paramMap.get('groupID');
    console.log('assasasdsdsds', this.groupChatID)

    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());

     if (this.groupChatID) {
      this.showGroupList = true;
     }
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

    ngAfterViewInit() {
    this.cdRef.detectChanges(); 
  }
  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showGroupList = false;
    }
  }

  toggleGroupList(forceOpen: boolean = false): void {
    this.showGroupList = forceOpen || !this.showGroupList;
  }

  opeGroupChat(): void {
    this.showGroupList = !this.showGroupList;
    console.log('aslkdnalkd', )
  }

}
