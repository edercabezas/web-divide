import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';
import { DatePipe, Location, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../core/services/general/general.service';
import { ChatService } from '../../core/services/chat/chat.service';
import { Subscription } from 'rxjs';
import { OptionAdvertisementComponent } from '../option-advertisement/option-advertisement.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from '../../core/services/group/group.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ModalMembersComponent } from '../modal-members/modal-members.component';
import { AlertService } from '../../core/services/alert/alert.service';
import { AdsComponent } from '../ads/ads.component';

@Component({
  selector: 'app-chat-shared',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatIcon,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbar,
    NgClass,
    DatePipe,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatIconModule,
    AdsComponent
],
  templateUrl: './chat-shared.component.html',
  styleUrl: './chat-shared.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "es-ES" }],
})
export class ChatSharedComponent implements OnInit, OnChanges, OnDestroy {

  @Input() groupChatID: string = '';
  @Output() closeChat = new EventEmitter<any>();
  @Output() closeChatGroup = new EventEmitter<any>();

  public _chat: ChatService = inject(ChatService);
  _routeActivate: ActivatedRoute = inject(ActivatedRoute);
  _general: GeneralService = inject(GeneralService);
  dialog: MatDialog = inject(MatDialog);
  _groupService: GroupService = inject(GroupService);
  _alert: AlertService = inject(AlertService);

  private ListMemberGroup: any;
  dataGroup: any;
  getMessageData: any[] = [];
  message: string = '';
  countRegisterChat: any;
  membersCount: number = 0;
  colectionRegisterChat: any;
  private messagesSub: Subscription | undefined;
  conuntGroup: number = 0;
  countShare: number = 0;
  countExpense: number = 0;
  countChat: number = 0;

  public closeGroup: boolean = false;

  constructor(private location: Location) { }

  ngOnInit(): void {
    this.getCountChat();
    this.getMemberGroup();
    this.getConfiguration();
    this.messagesSub = this._chat.messages$.subscribe((msgs) => {
      this.getMessageData = msgs;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupChatID'] && this.groupChatID) {
      this.getGroup(this.groupChatID);
      this._chat.getMessages(this.groupChatID);
      this.returnNumberMembers();
      this.getMemberGroup();

    }
  }

  closeGroupChat(): void {
    this.closeChatGroup.emit();
  }
  ngOnDestroy(): void {
    this.messagesSub?.unsubscribe();

  }

  selectImgProduct(): void {
  }

  sendMessage(): void {
    console.log(this.countRegisterChat, this.countChat)
    if (this.countRegisterChat > this.countChat) {
      this.modalAnuncioGroup();
      return;
    }
    this.updateCreateRegister();
    this.createNotification();

    if (this.message.trim()) {
      const data: any = {
        chatID: this._general.generateId(),
        chatMessage: this.message,
        userID: this._general.getStorage()?.userID,
        groupID: this.groupChatID,
        userName: this._general.getStorage()?.userName
      };
      this._chat.createMessage(data).catch((error: any) => {
        console.error(error);
      });
      this.message = '';
    }
  }

  scrollToBottom(): void {
    const el = document.getElementById('chat-body');
    if (el) el.scrollTop = el.scrollHeight;
  }

  getGroup(groupID: string): void {
    this._chat.getGroupChat(groupID).then((response: any) => {
      this.dataGroup = response;
    });
  }

  returDate(timestamp: any): Date {
    return timestamp?.toDate?.() || null;
  }

  goBack(): void {
    this.closeChat.emit();
  }

  returnNumberMembers(): void {
    this._groupService.returnNumberMembers(this.groupChatID).then((response: any) => {
      this.membersCount = response?.membersCount;
    })
  }

  getCountChat(): void {
    this._groupService.readGroupMessage(this._general.getStorage()?.userID, 'Chat').then((response) => {
      this.countRegisterChat = response?.groupDoc?.amountRegister;
      this.colectionRegisterChat = response?.groupId;
    })
  }

  updateCreateRegister(): void {

    if (this.countRegisterChat) {
      this.countChatUpdate();
      return;
    }
    this.countChatCreate();
  }

  countChatCreate(): void {
    const data = {
      userID: this._general.getStorage()?.userID,
      muduloName: 'Chat',
      amountRegister: this.countRegisterChat ? this.countRegisterChat + 1 : 1,
      groupMessaID: this._general.generateId()
    };
    this._groupService.countGroupMessageCreate(data).then((response: any) => {
      console.log(response);
      this.getCountChat();
    });
  }

  countChatUpdate(): void {
    const registerNumber = this.countRegisterChat ? this.countRegisterChat + 1 : 1;
    this._groupService.updateCountRegister(registerNumber, this.colectionRegisterChat).then((response: any) => {
      console.log(response);
      this.getCountChat();
    })
  }


  modalAnuncioGroup(): void {
    const dialogRef = this.dialog.open(OptionAdvertisementComponent, {
      width: '600px',
      height: '500px',
      disableClose: true,
      data: 'Para seguir interactuando con los participantes de este grupo puedes ver un anuncio esto nos ayudara!',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.countRegisterChat = 0;
        this.countChatUpdate();
      }
    });
  }

  createNotification(): void {
    const data = {
      groupID: this.groupChatID,
      groupName: this.dataGroup?.group,
      userID: this._general.getStorage()?.userID,
      userName: this._general.getStorage()?.userName,
      typeNotification: 'message',
      message: this.message,
      status: false,
      colorNotification: '#158b54',
      iconNotification: 'chat'
    };
    this._general.createNotificationGeneral(data, '/notification').then((response: any) => {
      console.log(response);
    });
  }

  public shareGroup(): void {
    this._general.sharedLink(this.dataGroup);
  }

  getMemberGroup(): void {
    this._chat.getMembersChat(this.groupChatID).then((response: any) => {
      this.ListMemberGroup = response;
      console.log(response)
    })
  }

  modalMembers(): void {
    console.log(this.groupChatID)
    const dialogRef = this.dialog.open(ModalMembersComponent, {
      width: '400px',
      disableClose: true,
      data: this.ListMemberGroup,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        this.deleteMember(result.uid, result.userName);
      }
    });
  }

  deleteMember(memberId: string, name: string = ''): void {
    this._chat.removeGroupMember(memberId).then(() => {
      this.closeGroup = true;
      this.getMemberGroup();
      if (name) {
        this._alert.showToasterFull(`Removiste a ${name} del grupo`);
      } else {
        this._alert.showToasterFull(`Acabas de salir del grupo`);
      }

    })
  }

  getDataExitGroup(): void {
    const userID: any = this._general.getStorage()?.userID;
    const userName: any = this._general.getStorage()?.userName;
    this._chat.getDataUserGroupDelete(userID, this.groupChatID).then((response: any) => {
      console.log(response)
      this.deleteMember(response, userName);
    })
  }

  getConfiguration(): void {
    this._general.getGroupChat().then((response: any) => {
      this.fiterMyOption(response);
    });
  }

  fiterMyOption(data: any): void {

    const conuntGroup = data.filter((item: any) => item.module === 'Group');
    const countShare = data.filter((item: any) => item.module === 'Shared');
    const countExpense = data.filter((item: any) => item.module === 'Expense');
    const countChat = data.filter((item: any) => item.module === 'Chat');

    console.log(countChat)
    this.conuntGroup = conuntGroup[0].value;
    this.countShare = countShare[0].value;
    this.countExpense = countExpense[0].value;
    this.countChat = countChat[0].value;

  }

  searchUser(): void {

  }

}
