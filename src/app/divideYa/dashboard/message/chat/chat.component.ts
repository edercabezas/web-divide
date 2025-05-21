import { Component, inject, OnInit } from '@angular/core';
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
import { CrudService } from '../../../core/services/crud/crud.service';
import { GeneralService } from '../../../core/services/general/general.service';
@Component({
  selector: 'app-chat',
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
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
    providers: [{ provide: MAT_DATE_LOCALE, useValue: "es-ES" }],
})
export default class ChatComponent implements OnInit{
  message: string = '';

  public _crud: CrudService = inject(CrudService);
  _routeActivate: ActivatedRoute = inject(ActivatedRoute);
  _general: GeneralService = inject(GeneralService);
  dataGroup: any;
  groupChatID: any;
  getMessageData: any[] = [];

constructor(private location: Location) {}
  
ngOnInit(): void {
   this.groupChatID = this._routeActivate.snapshot.paramMap.get('groupID');

  this.getGroup(this.groupChatID);
   this._crud.getMessages(this.groupChatID)
   this.getMessageGeneral();


    this._crud.messages$.subscribe((msgs) => {
      this.getMessageData = msgs;
      console.log(msgs);
      setTimeout(() => this.scrollToBottom(), 100);
    });

    console.log(this.groupChatID);
  }
  public containerSend(): void {
  }


   sendMessage() {
    
    if (this.message.trim()) {
        const data: any = {
          chatID: this._general.generateId(),
          chatMessage: this.message,
          userID: this._general.getStorage()?.userID,
          groupID: this.groupChatID,
          userName: this._general.getStorage()?.userName
        };
        this._crud.createMessage(data).then((response: any) => {
            console.log(response);
        }).catch((error: any) => {
          console.log(error)
        });

      this.message = '';
    }
  }


  getMessageGeneral(): void {
    this._crud.messages$.subscribe((msgs) => {
      this.getMessageData = msgs;
      console.log(msgs);
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  scrollToBottom() {
    const el = document.getElementById('chat-body');
    if (el) el.scrollTop = el.scrollHeight;
  }

  getGroup(groupID: string): void {
    this._crud.getGroupChat(groupID).then((resposne: any) => {
        console.log(resposne);
        this.dataGroup = resposne;
    });
  }


  returDate(timestamp: any): Date {
      return timestamp?.toDate?.() || null;
  }
  
  goBack(): void {
    this.location.back();
  }

}
