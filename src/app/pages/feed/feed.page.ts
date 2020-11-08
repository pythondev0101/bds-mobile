import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { StorageService } from 'src/app/services/storage.service';
import { DetailComponent } from 'src/app/components/detail/detail.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss']
})
export class FeedPage implements OnInit {
 
  deliveries: any;
  loading: any;
  has_deliveries: boolean = false;
  messenger_id : number;

  constructor(private router: Router,
    private httpService: HttpService,
    private storageService: StorageService,
    private toastService: ToastService,
    public modalCtrl: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService) {

  }
  
  ngOnInit() {
  }

  ionViewDidEnter(){
    this.storageService.get('userData').then(
      data => {
        this.messenger_id = data.id
    this.getDeliveries();
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
      console.log(e);
    }

  }

  async getDeliveries(){
    this.loading = await this.loadingController.create({
      message: 'Loading data, please wait...',
    });
    
    this.loading.present();
    const url = 'bds/api/deliveries?query=by_messenger&messenger_id=' + this.messenger_id;
    this.httpService.get(url).subscribe(
      (res: any) => {
        if (res.deliveries.length > 0){
          this.deliveries = res.deliveries;
          this.has_deliveries = true;
          console.log("meron");
          this.loading.dismiss();
        }else{
          this.has_deliveries = false;
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
    this.getDeliveries();
  }

  logoutAction() {
    this.authService.logout();
  }

}
