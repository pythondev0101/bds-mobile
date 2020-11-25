import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallbackID, Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { PhotoService } from 'src/app/services/photo.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';


const { Camera, Geolocation } = Plugins;


@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  id: any;
  messenger_id: any;
  loading: any;
  can_send :boolean = false;
  has_image :boolean = false;
  watchCoordinate: any;
  watchID: CallbackID;

  postData = {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    messenger_id: 0,
    subscriber_id: 0,
    date_mobile_delivery:  ""
  }

  constructor(public photoService: PhotoService,private router: Router,private httpService: HttpService,private storageService: StorageService,
    private toastService: ToastService,private route: ActivatedRoute, private loadingController:LoadingController, private zone: NgZone) {

      this.route.params.subscribe(params => {
        this.postData.subscriber_id = params['value'];
      });

      this.watchPosition();

  }
  

  ngOnInit(){
  }

  ionViewDidEnter(){

    this.storageService.get('userData').then(
      data => {
        this.messenger_id = data.id
      });
  }


  watchPosition() {
    try {
      this.watchID = Plugins.Geolocation.watchPosition({enableHighAccuracy: true}, (position, err) => {
        this.zone.run(() => {
          this.watchCoordinate = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.can_send = true;
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  clearWatch() {
    if (this.watchID != null) {
      Plugins.Geolocation.clearWatch({ id: this.watchID });
    }
  }

  async getLocationAndSend() {

    this.toastService.presentToast('Delivering, please wait...');

    this.postData.latitude = this.watchCoordinate.latitude;
    this.postData.longitude = this.watchCoordinate.longitude;
    this.postData.accuracy = this.watchCoordinate.accuracy;

    const date = new Date();
    this.postData.date_mobile_delivery = date.toLocaleString();

    console.log(this.postData);

    this.httpService.post('bds/api/confirm-deliver', this.postData).subscribe(
      (res: any) => {
        if (res.result) {
                
          let delivery_id: string = res.delivery.id;
                
          this.toastService.presentToast('Uploading image, please wait...');

          //Upload Image if successfully
          for(let i=0; i < this.photoService.images.length; i++){
            this.photoService.upload(this.photoService.images[i].webviewPath, this.photoService.images[i].imageName, delivery_id);
          }
          this.router.navigate(['home']);
        }
      },
      (error: any) => {
        this.toastService.presentToast('Network Issue.');
      });
  }

  confirmDeliver() {
    this.getLocationAndSend();
  }

  async addImage() {
    const date = new Date();
    const subscriber = "subs_" + this.postData.subscriber_id;
    const img_name: string = date.toDateString() + "_" + date.toLocaleTimeString() + "_" + subscriber + ".jpg";

    this.photoService.addNewToGallery(img_name);
    this.has_image = true;
  }

}
