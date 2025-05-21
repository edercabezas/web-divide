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
import { CrudService } from '../../core/services/crud/crud.service';
import { GeneralService } from '../../core/services/general/general.service';
import { ChatService } from '../../core/services/chat/chat.service';
import { Subscription } from 'rxjs';

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
  ],
  templateUrl: './chat-shared.component.html',
  styleUrl: './chat-shared.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "es-ES" }],
})
export class ChatSharedComponent implements OnInit, OnChanges, OnDestroy {

  @Input() groupChatID: string = '';
  @Output() closeChat = new EventEmitter<any>();

  public _chat: ChatService = inject(ChatService);
  _routeActivate: ActivatedRoute = inject(ActivatedRoute);
  _general: GeneralService = inject(GeneralService);

  dataGroup: any;
  getMessageData: any[] = [];
  message: string = '';
  private messagesSub: Subscription | undefined;

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.messagesSub = this._chat.messages$.subscribe((msgs) => {
      this.getMessageData = msgs;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupChatID'] && this.groupChatID) {
      this.getGroup(this.groupChatID);
      this._chat.getMessages(this.groupChatID);
    }
  }

  ngOnDestroy(): void {
    this.messagesSub?.unsubscribe();
  }

  sendMessage(): void {
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
}
