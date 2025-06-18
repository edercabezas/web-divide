import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {HeaderComponent} from '../../shared/header/header.component';
import {MenuComponent} from '../../shared/menu/menu.component';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    MenuComponent,
    MatDrawerContainer,
    HeaderComponent,
    MatDrawer,
    MatButton,
    MatIcon,
    FooterComponent
],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent implements OnInit{

  status: boolean;

  constructor() {
    this.status = false;
  }

  ngOnInit(): void {
    // this._showMenu();
  }


  public getStatusHeader(): void {
    this.status = !this.status;
  }

  public disguiseMenu(): void {
    this.status = false
  }

  public optionClickMenu(status: any): void {
    this.status = false
    console.log('sakjdbjksabjk')
  }
//   public esDispositivoMovil(): boolean {
//     const userAgent = navigator?.userAgent || navigator?.vendor || (window as any).opera;
//     return /android|iphone|ipad|ipod|windows phone/i.test(userAgent);
//   }
//
// private _showMenu(): void {
//
//   this.status = !this.esDispositivoMovil();
// }
//

}
