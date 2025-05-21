import {Component, inject, OnInit} from '@angular/core';

import { DatePipe} from '@angular/common';
import WaterComponent from '../../shared/water/water.component';

@Component({
  selector: 'app-home',
  imports: [
    WaterComponent
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DatePipe]
})
export default class HomeComponent {}
