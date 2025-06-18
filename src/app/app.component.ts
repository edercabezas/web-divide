import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  deferredPrompt: any;
  showInstallBanner = false;

  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallBanner = true;
    });

    window.addEventListener('appinstalled', () => {
      this.showInstallBanner = false;
    });
  }

  installApp(): void {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();

      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        this.deferredPrompt = null;
        this.showInstallBanner = false;
      });
    }
  }

  dismissBanner(): void {
    this.showInstallBanner = false;
  }
}