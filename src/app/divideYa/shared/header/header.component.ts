import {Component, EventEmitter, inject, Output} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import { AuthService } from '../../core/services/suth/auth.service';
import { SpinerComponent } from '../spiner/spiner.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatMenuTrigger,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatIconModule,
    SpinerComponent
],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() returnInformation = new EventEmitter<any>();

  private _auth: AuthService = inject(AuthService);
  private _router: Router = inject(Router);

  status: boolean = false;
  public dataStorage: any;
  public spinnerShow: boolean = false;

  setDataFather() {
    this.returnInformation.emit();
  }

  
  public logoutSection(): void {
    this.spinnerShow = true;
    localStorage.removeItem('dataUser');
    setTimeout(() => {
      this._auth.logout();
      this.spinnerShow = false;
    }, 1000)

  }

  public setNotification(): void {
    this._router.navigateByUrl('dashboard/notification');
  }

  profileUser(): void {
     this._router.navigateByUrl('/dashboard/perfil');
  }

    public statistics(): void {
    this._router.navigateByUrl('dashboard/estadistica');
  }
}
