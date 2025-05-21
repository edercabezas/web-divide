import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastr: ToastrService) {
  }

  showToasterFull(mensaje: string): void {
    this.toastr.success(mensaje);
  }

  showToasterError(mensaje: string): void {
    this.toastr.error(mensaje);
  }

  showToasterUpdate(mensaje: string): void {
    this.toastr.success(mensaje);
  }

  showToasterWarning(mensaje: string): void {
    this.toastr.warning(mensaje);
  }


}
