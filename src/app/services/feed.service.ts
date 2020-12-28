import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { LoadingController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';


@Injectable({
  providedIn: 'root'
})
export class FeedService {
  deliveries: any;
  deliveriesBackup: any;
  loading: any;
  has_deliveries: boolean = false;
  messenger_id : number;

  constructor(private httpService: HttpService,private loadingController: LoadingController,
    private toastService: ToastService) { }

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
          this.deliveriesBackup = res.deliveries;
          this.has_deliveries = true;
          this.loading.dismiss();
        }else{
          this.has_deliveries = false;
          this.loading.dismiss();
        }
      },
      (error: any) => {
        this.loading.dismiss();
        this.toastService.presentToast('Network Issue.');
        console.log(error);
      }
    );
  }

  sendDelivery(delivery_id){
    this.deliveries.find(item => item.id == delivery_id).status = "DELIVERING";
  }

  updateDelivery(delivery_id: number, status: string){
    console.log(JSON.stringify(this.deliveries));
    console.log(delivery_id, status);
    this.deliveries.find(item => item.id == delivery_id).status = status;
    console.log(JSON.stringify(this.deliveries));
  }
}
