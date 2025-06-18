import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GeneralService } from '../../core/services/general/general.service';
import { Timestamp } from 'firebase/firestore';
import { NotificationService } from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-notification',
  imports: [
    MatCardModule,
    MatIconModule,
  ],
  standalone: true,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {


  private _notification: NotificationService = inject(NotificationService);
  _general: GeneralService = inject(GeneralService);

  notifications: any;

  constructor() {

  }


  ngOnInit(): void {
    this.getdataNotification();

  }


  getdataNotification(): void {
    this._notification.getUserNotifications(this._general.getStorage()?.userID).then((response: any) => {
      console.log(response);
      this.notifications = response;
    })
  }


  returDate(dateFire: any): any {
    const date: Date = dateFire.toDate();
    return date.toLocaleString();
  }
}
