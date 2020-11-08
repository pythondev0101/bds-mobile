import { Component, OnInit } from '@angular/core';
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

  postData = {
    latitude: 0,
    longitude: 0,
    messenger_id: 0,
    subscriber_id: 0,
  }

  constructor(public photoService: PhotoService,private router: Router,private httpService: HttpService,private storageService: StorageService,
    private toastService: ToastService,private route: ActivatedRoute, private loadingController:LoadingController) {

      this.route.params.subscribe(params => {
        this.postData.subscriber_id = params['value'];
      });
  }

  ngOnInit(){
  }

  async getLocationAndSend() {
    this.loading = await this.loadingController.create({
      message: 'Delivering, please wait... (Check your location if enabled)',
    });
    this.loading.present();

    const position = await Geolocation.getCurrentPosition().then(
      pos => {

        this.postData.latitude = pos.coords.latitude;
        this.postData.longitude = pos.coords.longitude;

        this.storageService.get('userData').then(
          data => {this.postData.messenger_id = data.id}
          );
    
        this.httpService.post('bds/api/confirm-deliver', this.postData).subscribe(
            (res: any) => {
              if (res.result) {
                this.loading.dismiss();
                
                let delivery_id: string = res.delivery.id;
                
                //Upload Image if successfully
                for(let i=0; i < this.photoService.images.length; i++){
                  this.photoService.upload(this.photoService.images[i].webviewPath, this.photoService.images[i].imageName, delivery_id);
                }
                this.router.navigate(['home']);
              }
            },
            (error: any) => {
              this.loading.dismiss();
              this.toastService.presentToast('Network Issue.');
            }
        );
      }
    );
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
