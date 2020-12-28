import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { DetailComponent } from 'src/app/components/detail/detail.component';
import { FeedService } from 'src/app/services/feed.service';
import { NetworkListenerService } from 'src/app/services/network-listener.service';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss']
})
export class FeedPage implements OnInit {

  constructor(public feedService: FeedService,
    private storageService: StorageService,
    private toastService: ToastService,
    public modalCtrl: ModalController,
    private authService: AuthService,
    private networkListenerService: NetworkListenerService) {

  }
  
  ionViewWillEnter(){
    this.storageService.get('userData').then(
      data => {
        this.feedService.messenger_id = data.id
        console.log(data);
      });
  }

  async openModal(delivery){
    try{
      const modal = await this.modalCtrl.create({
        component: DetailComponent,
        componentProps: {
          delivery: delivery,
          subscriber_id: delivery.subscriber_id
        }
      });
      await modal.present();       

    }catch(e){
      this.toastService.presentToast("Error occured!");
    }

  }

  async filterSearch(evt){
    this.feedService.deliveries = this.feedService.deliveriesBackup;
    const search_value = evt.srcElement.value;

    if (search_value == ""){
      return;
    }

    this.feedService.deliveries = this.feedService.deliveries.filter(delivery => {

        return (delivery.subscriber_lname.toLowerCase().indexOf(search_value.toLowerCase()) > -1);
    });
  }

  refresh(){
    this.feedService.getDeliveries();
  }

  
  async ngOnInit() {
    // this.networkListener = Network.addListener('networkStatusChange', (status) => {
    //   console.log("Network status changed", status);

    //   if (status.connected == false){
    //   this.toastService.presentToast("Network disconnected!");

    //   } else {
    //     this.toastService.presentToast("Network connected!");
    //     this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
    //       if (status == ConnectionStatus.Online) {
    //         this.offlineManager.checkForEvents().subscribe();
    //       }
    //   });
    //   }
    //   this.networkStatus = status;
    // });

    // this.networkStatus = await Network.getStatus();
  }

  // ngOnDestroy() {
  //   this.networkListenerService.networkListener.remove();
  // }

  logoutAction() {
    this.authService.logout();
  }

}
