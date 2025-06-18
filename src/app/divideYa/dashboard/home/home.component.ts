import { Component, inject, OnInit } from '@angular/core';

import { DatePipe } from '@angular/common';
import WaterComponent from '../../shared/water/water.component';
import { GoogleAdsenseComponent } from '../../shared/google-adsense/google-adsense.component';
import { ApiService } from '../../core/services/api-externas/api.service';
import { MatCard } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    WaterComponent,
    GoogleAdsenseComponent,
    MatCard
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DatePipe]
})
export default class HomeComponent implements OnInit {
  dataNotices: any[] = [];
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getNotices();
  }

  getNotices(): void {
    this.api.getNotice().then((response) => {
      this.dataNotices = response.items;
      console.log(response)
    })
  }

  public linkNotices(url: string): void {
    console.log(url)

  }
}
