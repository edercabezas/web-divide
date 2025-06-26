import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-native-banner',
  imports: [],
  templateUrl: './native-banner.component.html',
  styleUrl: './native-banner.component.scss'
})
export class NativeBannerComponent {

    iframeUrl: SafeResourceUrl;


  constructor(private sanitizer: DomSanitizer) {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/home/anuncio.html');
  }

  


// ngAfterViewInit(): void {
//     const script = document.createElement('script');
//     script.src = '//pl26957695.profitableratecpm.com/47af123886eb00123649817d94c4aeb2/invoke.js';
//     script.async = true;
//     script.setAttribute('data-cfasync', 'false');
//     document.getElementById('native-container')?.appendChild(script);
//   }
}