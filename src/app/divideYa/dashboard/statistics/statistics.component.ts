import { Component } from '@angular/core';
import { ButtonBackComponent } from '../../shared/button-back/button-back.component';
import { GraphicsComponent } from '../../shared/graphics/graphics.component';

@Component({
  selector: 'app-statistics',
  imports: [
    ButtonBackComponent,
    GraphicsComponent
],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {

}
