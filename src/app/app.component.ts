import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { CacheService } from 'ionic-cache';
import { OfflineManagerService } from './services/offline-manager.service';
import { NetworkService, ConnectionStatus } from './services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService
    // private cache: CacheService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      // this.cache.setDefaultTTL(60 * 60 * 24);
      // this.cache.setOfflineInvalidate(false);

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      //   if (status == ConnectionStatus.Online) {
      //     this.offlineManager.checkForEvents().subscribe();
      //   }
      // });

    });
  }
}
