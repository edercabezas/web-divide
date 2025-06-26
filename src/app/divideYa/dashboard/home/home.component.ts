import { Component, inject, OnInit } from '@angular/core';

import { DatePipe } from '@angular/common';
import WaterComponent from '../../shared/water/water.component';
import { ApiService } from '../../core/services/api-externas/api.service';
import { MatCard } from '@angular/material/card';
import { NativeBannerComponent } from '../../shared/native-banner/native-banner.component';
import { AdsComponent } from '../../shared/ads/ads.component';


@Component({
  selector: 'app-home',
  imports: [
    WaterComponent,
    MatCard,
    AdsComponent,
    NativeBannerComponent
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
