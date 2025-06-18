import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  menu: any[] = [];

  constructor() {

  }
  ngOnInit(): void {

    this._getMenuItems()

  }

  private _getMenuItems(): void {

    this.menu = [
      {
        name: 'Inicio',
        icon: 'home',
        router: '/dashboard'
      },
      {
        name: 'Gastos',
        icon: 'group',
        router: '/dashboard/mis-grupos'
      },
      {
        name: 'Chat',
        icon: 'chat',
        router: '/dashboard/chats'
      },
      {
        name: 'Premios',
        icon: 'paid',
        router: 'recompensa'
      }
    ]

  }

}
