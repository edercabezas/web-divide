import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpC: HttpClient) { }

  private API_UBICACION = 'https://api.ipbase.com/v1/json/';
  private NORICES = 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada';


  async getUbicacion(): Promise<any> {
    const response = await fetch(this.API_UBICACION);
    return await response.json();
  }

  async obtenerDatosClima(longitud: any, latitud: any): Promise<any> {
    const TIEMPO: any = `https://www.7timer.info/bin/civillight.php?lon=${longitud}&lat=${latitud}&ac=0&unit=metric&output=json`;

    const  response = await fetch(TIEMPO)
    return await response.json();
  }

  public getClearDate(value: any): any {
    value = "" + value;

    if (!value) {
      return "";
    }

    const year = value.substring(0, 4);
    const month = value.substring(4, 6);
    const day = value.substring(6, 8);

    return `${year}-${month}-${day}`;

  }

 async getNotice(): Promise<any> {
    const  response = await fetch(this.NORICES);
    return await response.json();

  }

}
