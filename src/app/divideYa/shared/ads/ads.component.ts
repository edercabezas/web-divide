import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ads',
  imports: [
    MatDialogContent,
    MatDialogActions,
  ],
  standalone: true,
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent {

  
  @ViewChild('adContainer', { static: false }) adContainer!: ElementRef;
iframeUrl: SafeResourceUrl;


  desbloqueado = false;
  cargando = false;


    constructor(private sanitizer: DomSanitizer) {
     const url = 'https://www.profitableratecpm.com/xyq3q3rinq?key=eb27d0b846f449f56cac4f07d8c61cb9';
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }






  ngAfterViewInit(): void {
    if (!this.adContainer) {
      console.error('Contenedor no encontrado');
      return;
    }

    const container = this.adContainer.nativeElement;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = '//pl26949666.profitableratecpm.com/f0/28/6a/f0286af5c5c0199b598f58c9d5ffda62.js';
    script.async = true;
    script.type = 'text/javascript';
    container.appendChild(script);

  }
}

