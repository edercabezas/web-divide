import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-google-adsense',
  templateUrl: './google-adsense.component.html',
  styleUrls: ['./google-adsense.component.scss'],
})
export class GoogleAdsenseComponent implements AfterViewInit, OnDestroy {
  @Input() adSlot!: string;
  @Input() adFormat: string = 'auto';
  @Input() fullWidthResponsive: string = 'true';

  @ViewChild('adContainer') adContainer!: ElementRef;

  private timeoutId: any;

  ngAfterViewInit(): void {
    // this.timeoutId = setTimeout(() => this.loadAds(), 300); // Delay más largo por seguridad
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }

private loadAds(): void {
  if (typeof window === 'undefined') return;

  const ads = document.getElementsByClassName('adsbygoogle');
  Array.from(ads).forEach((ad) => {
    if (!(ad as HTMLElement).getAttribute('data-adsbygoogle-status')) {
        (window as any).adsbygoogle.push({});
    }
  });
}

}
