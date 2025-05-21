import {Component, inject, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api-externas/api.service';
import {MatCard} from '@angular/material/card';
import {StateDayPipe} from '../../core/pipe/state-day.pipe';
import {DayDatePipe} from '../../core/pipe/day-date.pipe';

@Component({
  selector: 'app-water',
  imports: [
    MatCard,
    StateDayPipe,
    DayDatePipe
  ],
  standalone: true,
  templateUrl: './water.component.html',
  styleUrl: './water.component.scss',
  providers: [StateDayPipe]
})
export default class WaterComponent implements OnInit {
  _api: ApiService = inject(ApiService)
  city: any;
  department: any;
  country: any
  detailNow: any;
  detailNewDay: any;
  constructor() {
  }

  ngOnInit(): void {
    this.setClima();
    this.getUbication();
    }


  public getUbication(): void {



    this._api.getUbicacion().then((response: any) => {
      console.log(response)

      this.city = response.city;
      this.department = response.region_name;
      this.country = response.country_name;


      this._getObtenerClima(response.longitude, response.latitude);


    }).catch(() => {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((response: any) => {
          this._getObtenerClima(response.coords.longitude, response.coords.latitude);
        });

      }

    });

  }

  private _getObtenerClima(setLongitud: any, setLatitudes: any): void {


    this._api.obtenerDatosClima(setLongitud, setLatitudes).then((response: any) => {

      console.log(response)

      this.detailNow = response.dataseries.splice(0, 1)[0];
      this.detailNewDay = response.dataseries;


    }).catch((error: any) => {
      console.log(error);
    });
  }



  public returnImg(img: string): string {

    return `assets/clima/${img}.png`
  }

  setClima(): void {

    this.detailNow = {
      temp2m: {
        min: 0,
        max: 0
      },
      date: '',
      weather: '',
      wind10m_max: 0
    };
  }

}
