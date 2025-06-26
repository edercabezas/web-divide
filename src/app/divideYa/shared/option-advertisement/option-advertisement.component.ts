import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-option-advertisement',
  imports: [
    MatDialogModule
  ],
  standalone: true,
  templateUrl: './option-advertisement.component.html',
  styleUrl: './option-advertisement.component.scss'
})
export class OptionAdvertisementComponent implements OnInit {


  readonly dialogRef = inject(MatDialogRef<OptionAdvertisementComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  desbloqueado = false;
  cargando = false;

  ngOnInit(): void {
    console.log(this.data);
  }


  iframeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    const url = 'https://www.profitableratecpm.com/xyq3q3rinq?key=eb27d0b846f449f56cac4f07d8c61cb9';
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/home/anuncio.html');
  }

  cerrar() {
    this.dialogRef.close(true);
  }

  verAnuncio() {
    this.cargando = true;

    setTimeout(() => {
      this.cargando = false;
      this.desbloqueado = true;
      this.dialogRef.close(true);
    }, 10000); // Simula que después de 10s se desbloquea
  }
}
