import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-button-back',
  imports: [MatIcon,
    MatButton
  ],
  standalone: true,
  templateUrl: './button-back.component.html',
  styleUrl: './button-back.component.scss'
})
export class ButtonBackComponent {

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }

}
