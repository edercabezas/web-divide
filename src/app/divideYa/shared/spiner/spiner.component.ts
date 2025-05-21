import { Component, Input } from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
@Component({
  selector: 'app-spiner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './spiner.component.html',
  styleUrl: './spiner.component.scss'
})
export class SpinerComponent {
  @Input() title: string = 'Estamos procesando su solicitud';
}
