import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {CdkAccordion, CdkAccordionItem} from '@angular/cdk/accordion';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatSuffix} from '@angular/material/form-field';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../core/services/suth/auth.service';
import { SpinerComponent } from '../spiner/spiner.component';
import { GeneralService } from '../../core/services/general/general.service';

@Component({
  selector: 'app-menu',
  imports: [
    CdkAccordion,
    MatIcon,
    MatSuffix,
    CdkAccordionItem,
    RouterLinkActive,
    MatIconModule,
    SpinerComponent
],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{

  private _route: Router = inject(Router);
  private _auth: AuthService = inject(AuthService);
  _general: GeneralService = inject(GeneralService);
  @Output() closeMenu!: EventEmitter<any>;
  public menu: any[];
  public dataStorage: any;
  public spinnerShow: boolean = false;
  constructor() {
    this.menu = [];
    this.closeMenu = new EventEmitter();
  }

  ngOnInit(): void {
    this._getUserStorage();
    this._getMenuItems();

  }

  private _getMenuItems(): void {

    this.menu = [
      {
        name: 'Inicio',
        icon: 'home',
        router: '/dashboard'
      },
      {
        name: 'Grupos',
        icon: 'group',
        router: '/dashboard/mis-grupos'
      },
      {
        name: 'Sala de Chat',
        icon: 'chat',
        router: '/dashboard/chats'
      },
      {
        name: 'Ganar',
        icon: 'pay',
        router: ''
      },
      {
        name: 'Configuración',
        icon: 'settings',
        router: ''
      },
    ]

  }

  public logoutSection(): void {
    this.spinnerShow = true;
    localStorage.removeItem('dataUser');
    setTimeout(() => {
      this._auth.logout();
      this.spinnerShow = false;
    }, 1000)

  }


  public redirectProfile(): void {
    this._route.navigateByUrl('dashboard/perfil');
    this.closeMenu.emit(true);
  }

  private _getUserStorage(): any {
    this.dataStorage = this._general.getStorage()
  }


  public selectOption(route: any): void {
    console.log('asddddddddddd',route)
    this._route.navigateByUrl(route)
    this.closeMenu.emit(true);
  }
}

