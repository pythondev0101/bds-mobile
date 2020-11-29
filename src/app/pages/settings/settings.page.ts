import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { SubscriberUpdateComponent } from 'src/app/components/subscriber-update/subscriber-update.component';
import { HttpService } from 'src/app/services/http.service';
import { LocationService } from 'src/app/services/location.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  
  messenger_id: any;
  loading: any;
  subscribers: any;
  subscribersBackup: any;
  has_subscribers: boolean;

  constructor(private authService: AuthService, private loadingController: LoadingController,
    private httpService: HttpService, private storageService: StorageService, private toastService: ToastService,
    public modalCtrl: ModalController, public locationService: LocationService) {
    }

  ngOnInit() {}

  async openModal(subs_id){
    try{
      const modal = await this.modalCtrl.create({
        component: SubscriberUpdateComponent,
        componentProps: {
          subscriber_id: subs_id
        }
      });
      await modal.present();       

    }catch(e){
      this.toastService.presentToast("Error occured!");
    }

  }
  
  ionViewDidEnter(){
    this.storageService.get('userData').then(
      data => {
        this.messenger_id = data.id
      });

    this.getSubscribers();
  }

  async getSubscribers(){
    this.loading = await this.loadingController.create({
      message: 'Loading data, please wait...',
    });
    
    this.loading.present();
    const url = 'bds/api/subscribers?query=by_messenger&messenger_id=' + this.messenger_id;
    this.httpService.get(url).subscribe(
      (res: any) => {
        if (res.subscribers.length > 0){
          this.subscribers = res.subscribers;
          this.subscribersBackup = res.subscribers;
          this.has_subscribers = true;
          this.loading.dismiss();
        }else{
          this.has_subscribers = false;
          this.loading.dismiss();
        }
      },
      (error: any) => {
        this.loading.dismiss();
        this.toastService.presentToast('Network Issue.');
      }
    );
  }
  
  refresh(){
    this.getSubscribers();
  }

  async filterSearch(evt){
    this.subscribers = this.subscribersBackup;
    const search_value = evt.srcElement.value;

    if (search_value == ""){
      return;
    }

    this.subscribers = this.subscribers.filter(subscriber => {

        return (subscriber.fname.toLowerCase().indexOf(search_value.toLowerCase()) > -1);
    });
  }


}
