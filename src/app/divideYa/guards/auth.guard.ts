import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { GeneralService } from '../core/services/general/general.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  private _general: GeneralService = inject(GeneralService);
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    // let data: any;
    const user: any = this._general.getStorage();
    // if (typeof window !== 'undefined') {
    //   data = localStorage.getItem('userCat');
    //   user = JSON.parse(data);
    // }

    return !!user;
  }
}
