import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'stateDay'
})
export class StateDayPipe implements PipeTransform {


  transform(status: string): unknown {
    let data: any;
    switch (status) {
      case 'clear':
        data = 'Claro';
        break;

      case 'cloudy':
        data = 'Nublado';
        break;

      case 'oshower':
        data = 'Ducha';
        break;

      case 'lightrain':
        data = 'Lluvia ligera';
        break;

      case 'mcloudy':
        data = 'Nube';
        break;

      case 'rain':
        data = 'Lluvia';
        break;

      case 'snow':
        data = 'Nieve';
        break;

      case 'tsrain':
        data = 'Cepa';
        break;

      default:
        data = 'Soleado';
        break;


    }
    return data;
  }

}
