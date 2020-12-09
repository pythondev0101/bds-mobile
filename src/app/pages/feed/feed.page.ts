import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { DetailComponent } from 'src/app/components/detail/detail.component';
import { FeedService } from 'src/app/services/feed.service';


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
    private authService: AuthService,) {
  }
  
  ngOnInit() {
  }

  ionViewDidEnter(){
    this.storageService.get('userData').then(
      data => {
        this.feedService.messenger_id = data.id
      });
  }

  async openModal(subs_id){
    try{
      const modal = await this.modalCtrl.create({
        component: DetailComponent,
        componentProps: {
          subscriber_id: subs_id
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

  test(){
    this.feedService.updateDelivery();
  }

  logoutAction() {
    this.authService.logout();
  }

}
