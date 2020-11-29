import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { LocationService } from 'src/app/services/location.service';
import { ToastService } from 'src/app/services/toast.service';
import { PhotoService } from 'src/app/services/photo.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @Input() subscriber_id: number;
  subscriber: any;
  loading: any;
  is_delivered: boolean = false;
  data = {
    fname: "",
    lname: "",
    address: "",
    email: "",
    status: "",
  };

  id: any;
  messenger_id: any;
  can_send :boolean = false;
  has_image :boolean = false;

  postData = {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    messenger_id: 0,
    subscriber_id: 0,
    date_mobile_delivery:  ""
  }

  
  constructor(private photoService: PhotoService, private modalCtrl: ModalController, private toastService: ToastService, private httpService: HttpService,
    private loadingController: LoadingController, public locationService: LocationService) {

  }

  ngOnInit() {
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }

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
          this.data.email = this.subscriber.email
          this.data.status = this.subscriber.status;

          this.postData.subscriber_id = this.subscriber_id;

          if (this.data.status == "DELIVERED" || this.data.status == "PENDING"){
            this.is_delivered = true;
          }
          this.loading.dismiss();
        }
      },
      (error: any) => {
        this.loading.dismiss();
        this.toastService.presentToast('Network Issue.');
      }
    );

  }

  deliver(){

    this.toastService.presentToast('Delivering, please wait...');

    const date = new Date();
    this.postData.date_mobile_delivery = date.toLocaleString();

    this.postData.latitude = this.locationService.watchCoordinate.latitude;
    this.postData.longitude = this.locationService.watchCoordinate.longitude;
    this.postData.accuracy = this.locationService.watchCoordinate.accuracy;

    this.httpService.post('bds/api/confirm-deliver', this.postData).subscribe(
      (res: any) => {
        if (res.result) {
                
          let delivery_id: string = res.delivery.id;
                
          this.toastService.presentToast('Uploading image, please wait...');

          //Upload Image if successfully
          for(let i=0; i < this.photoService.images.length; i++){
            this.photoService.upload(this.photoService.images[i].webviewPath, this.photoService.images[i].imageName, delivery_id);
          }

          this.modalCtrl.dismiss();
        }
      },
      (error: any) => {
        this.toastService.presentToast('Network Issue.');
      });
      
  }

  async addImage() {
    const date = new Date();
    const subscriber = "subs_" + this.postData.subscriber_id;
    const img_name: string = date.toDateString() + "_" + date.toLocaleTimeString() + "_" + subscriber + ".jpg";

    this.photoService.addNewToGallery(img_name);
    this.has_image = true;
    this.can_send = true;
  }

}
