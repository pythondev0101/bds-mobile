import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { LocationService } from 'src/app/services/location.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-subscriber-update',
  templateUrl: './subscriber-update.component.html',
  styleUrls: ['./subscriber-update.component.scss'],
})
export class SubscriberUpdateComponent implements OnInit {
  @Input() subscriber_id: number;
  subscriber: any;
  loading: any;
  data = {
    fname: "",
    lname: "",
    address: "",
    email: "",
    latitude: "",
    longitude: "",
  };
  postData = {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    messenger_id: 0,
    subscriber_id: 0,
  }

  constructor(private modalCtrl: ModalController, private toastService: ToastService, private httpService: HttpService,
    private loadingController: LoadingController, public locationService: LocationService) { }

  ngOnInit() {}

  async ionViewWillEnter() {
    this.loading = await this.loadingController.create({
      message: 'Loading data, please wait...',
    });
    
    this.loading.present();

    const url = "bds/api/subscribers/" + this.subscriber_id;

    this.httpService.get(url).subscribe(
      (res: any) => {
        if (res){
          this.subscriber = res;
          this.data.fname = this.subscriber.fname;
          this.data.lname = this.subscriber.lname
          this.data.address = this.subscriber.address;
          this.data.email = this.subscriber.email;
          this.data.latitude = this.subscriber.latitude;
          this.data.longitude = this.subscriber.longitude;

          this.postData.subscriber_id = this.subscriber_id;
         
          this.loading.dismiss();
        }
      },
      (error: any) => {
        this.loading.dismiss();
        this.toastService.presentToast('Network Issue.');
      }
    );

  }

  updateLocation(){
    this.toastService.presentToast('Updating, please wait...');

    this.postData.latitude = this.locationService.watchCoordinate.latitude;
    this.postData.longitude = this.locationService.watchCoordinate.longitude;
    this.postData.accuracy = this.locationService.watchCoordinate.accuracy;

    this.httpService.post('bds/api/subscriber/update-location', this.postData).subscribe(
      (res: any) => {
        if (res.result) {
          this.toastService.presentToast('Location updated successfully!');
          this.modalCtrl.dismiss();
        }
      },
      (error: any) => {
        this.toastService.presentToast('Network Issue.');
      });

  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }
}
