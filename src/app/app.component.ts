import { Component } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkListenerService } from './services/network-listener.service';
import { Plugins, NetworkStatus, PluginListenerHandle } from '@capacitor/core';
// import { CacheService } from 'ionic-cache';
import { OfflineManagerService } from './services/offline-manager.service';
import { NetworkService, ConnectionStatus } from './services/network.service';
import { ToastService } from './services/toast.service';

const { Network } = Plugins;

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
    private networkListenerService: NetworkListenerService,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService,
    // private events: Events,
    private toastService: ToastService
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

      this.networkListenerService.networkListener = Network.addListener('networkStatusChange', (status) => {
        console.log("Network status changed", status);
  
        if (status.connected == false){
        this.toastService.presentToast("Network disconnected!");
  
        } else {
          this.toastService.presentToast("Network connected!");
          this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
            if (status == ConnectionStatus.Online) {
              this.offlineManager.checkForEvents().subscribe();
            }
        });
        }
        this.networkListenerService.networkStatus = status;
      });
  
      // this.networkStatus = await Network.getStatus();

      // this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      //   if (status == ConnectionStatus.Online) {
      //     this.offlineManager.checkForEvents().subscribe();
      //   }
      // });

      // this.networkService.initializeNetworkEvents();

      // // Offline event
      // this.events.subscribe('network:offline', () => {
      //   this.toastService.presentToast("Network disconnected!");
      //   // alert('network:offline ==> ' + this.networkService.type);
      // });

      // // Online event
      // this.events.subscribe('network:online', () => {
      //   // alert('network:online ==> ' + this.network.type);
      //   this.toastService.presentToast("Network connected!");
      // });

    });
  }
}
