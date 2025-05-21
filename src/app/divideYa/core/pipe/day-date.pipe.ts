import { Pipe, PipeTransform } from '@angular/core';
import {ApiService} from '../services/api-externas/api.service';

@Pipe({
  standalone: true,
  name: 'dayDate'
})
export class DayDatePipe implements PipeTransform {


  constructor(private api: ApiService) {
  }

  transform(fechaCadena: any): string {

    fechaCadena = this.api.getClearDate(fechaCadena) + ' 00:00:00';

    const dias = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];

    const numberDay = new Date(fechaCadena).getDay();
    return dias[numberDay]
  }

}
