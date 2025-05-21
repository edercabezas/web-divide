import {Component, HostListener} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-add-group',
  imports: [
    MatIcon,
  ],
  standalone: true,
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.scss'
})
export class AddGroupComponent {


@HostListener('window:scroll', ['$event'])
  scrolled: number = 0;

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }


  @HostListener('window:scroll', ['$event'])  onWindowScroll(data: any) {
    this.scrolled  = window.scrollY;
  }

}
