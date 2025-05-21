import {Component, EventEmitter, Output} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon, MatIconModule} from "@angular/material/icon";


@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatButton,
    MatMenuTrigger,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatIconModule,
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() returnInformation = new EventEmitter<any>();
  status: boolean = false;


  setDataFather() {
    this.returnInformation.emit();
  }

  public logoutSection(): void {}
}
