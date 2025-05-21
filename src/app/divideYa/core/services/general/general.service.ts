import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  constructor() { }

  public generateId(): any {

    let getDay = new Date().getDay().toString();
    const constGetMonth = new Date().getMonth() + 1;
    let getHours = new Date().getHours().toString();
    let getMinutes = new Date().getMinutes().toString();
    const getFullYear =new Date().getFullYear().toString();
    const getSegundos =new Date().getMilliseconds();
    let getMonth = constGetMonth.toString();

    if (getDay.length === 1) {
      getDay = '0'+getDay;
    }

    if (getMonth.length === 1) {
      getMonth = '0'+getMonth;
    }

    if (getMonth.length === 1) {
      getHours = '0'+getHours;
    }

    if (getMinutes.length === 1) {
      getMinutes = '0'+getMinutes;
    }


    const dataFinish = `${getDay}${getMonth}${getFullYear}${getHours}${getMinutes}${getSegundos}`;

    return dataFinish.toString();

  }

  public getStorage(): any {
    if (typeof window !== 'undefined') {
      const data: any = localStorage.getItem('dataUser');
      return JSON.parse(data);
    }

  }

   sharedLink(group: any): void  {
    console.log(group)
    const inviteLink = `http://192.168.0.102:4200/invitado/${group.inviteToken}`;

    const message = `¡Hola! Te invito a unirte al grupo ${group.name}.
             Haz clic aquí para unirte: ${inviteLink}`;


    if (navigator.share) {
      navigator.share({
        title: 'Invitación a grupo',
        text: message,
        url: inviteLink
      }).catch(err => console.error('Error al compartir:', err));
    } else {

      const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');


      window.open(whatsappLink, '_blank');
    }

  }
  
  public generarToken(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }


}
