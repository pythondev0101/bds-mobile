import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation, Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { PhotoService } from 'src/app/services/photo.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';


const { Camera } = Plugins;


@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  id: any;
  loading: any;
  has_image :boolean = false;
  watchId: any;

  postData = {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    messenger_id: 0,
    subscriber_id: 0,
    date_mobile_delivery:  ""
  }

  constructor(public photoService: PhotoService,private router: Router,private httpService: HttpService,private storageService: StorageService,
    private toastService: ToastService,private route: ActivatedRoute, private loadingController:LoadingController, private ngZone: NgZone) {

      this.route.params.subscribe(params => {
        this.postData.subscriber_id = params['value'];
      });
  }

  ngOnInit(){
  }

  async getLocationAndSend() {

    // this.loading = await this.loadingController.create({
    //   message: 'Delivering, please wait... (Check your location if enabled)',
    // });
    // this.loading.present();

    this.toastService.presentToast('Delivering, please wait...');

    const position = await Geolocation.getCurrentPosition({timeout: 10000}).then(
      pos => {

        this.storageService.get('userData').then(
          data => {this.postData.messenger_id = data.id}
        );

        this.postData.latitude = pos.coords.latitude;
        this.postData.longitude = pos.coords.longitude;
        this.postData.accuracy = pos.coords.accuracy;

        const date = new Date();
        this.postData.date_mobile_delivery = date.toLocaleString();

        console.log(this.postData);

        this.httpService.post('bds/api/confirm-deliver', this.postData).subscribe(
            (res: any) => {
              if (res.result) {
                // this.loading.dismiss();
                
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
              // this.loading.dismiss();
              this.toastService.presentToast('Network Issue.');
            }
        );
      }
    );
    
    // try {
    //   this.watchId = await Geolocation.watchPosition({ enableHighAccuracy: true}, (position, err) => {
    //     this.ngZone.run(() => {
    //       if (err) { console.log('err', err); return; }
          
    //       const date = new Date();
        
    //       this.postData.latitude = position.coords.latitude;
    //       this.postData.longitude = position.coords.longitude;
    //       this.postData.date_mobile_delivery = date.toLocaleString();
    //       this.clearWatch();
    //     })
    //   })
    // }
    // catch (err) { console.log('err', err) }

    // console.log(this.postData);
    // this.httpService.post('bds/api/confirm-deliver', this.postData).subscribe(
    //   (res: any) => {
    //     if (res.result) {
    //       // this.loading.dismiss();
    //       let delivery_id: string = res.delivery.id;
    //       //Upload Image if successfully
    //       for(let i=0; i < this.photoService.images.length; i++){
    //         this.photoService.upload(this.photoService.images[i].webviewPath, this.photoService.images[i].imageName, delivery_id);
    //       }
    //       this.router.navigate(['home']);
    //     }
    //     },
    //         (error: any) => {
    //           // this.loading.dismiss();
    //           this.toastService.presentToast('Network Issue.');
    //         }
    //     );

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

  clearWatch() {
    if (this.watchId != null) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }

}
