import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { LocationService } from 'src/app/services/location.service';
import { ToastService } from 'src/app/services/toast.service';
import { PhotoService } from 'src/app/services/photo.service';
import { isUndefined } from 'util';
import { FeedService } from 'src/app/services/feed.service';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @Input() subscriber_id: number;
  @Input() delivery: any;
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

  messenger_id: any;
  can_send :boolean = false;
  has_image :boolean = false;

  postData = {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    messenger_id: 0,
    subscriber_id: 0,
    date_mobile_delivery:  "",
    delivery_id: 0
  }

  
  constructor(public photoService: PhotoService, private modalCtrl: ModalController, private toastService: ToastService, private httpService: HttpService,
    private loadingController: LoadingController, public locationService: LocationService,
    private feedService: FeedService,
    private apiService: ApiService) {

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

    this.data.fname = this.delivery.subscriber_fname;
    this.data.lname = this.delivery.subscriber_lname;
    this.data.address = this.delivery.subscriber_address;
    this.data.email = this.delivery.subscriber_email;
    this.data.status = this.delivery.status;
    this.postData.subscriber_id = this.delivery.subscriber_id;
    
    if (!(this.data.status == "IN-PROGRESS")){
      this.is_delivered = true;
    }

    this.loading.dismiss();
  }

  async deliver(){

    this.toastService.presentToast('Delivering, please wait...');

    try {
      
      const date = new Date();
      this.postData.date_mobile_delivery = date.toLocaleString('en-US');

      this.postData.messenger_id = this.feedService.messenger_id;
      this.postData.delivery_id = this.delivery.id;

      if(!(isUndefined(this.locationService.watchCoordinate))){
        this.postData.latitude = this.locationService.watchCoordinate.latitude;
        this.postData.longitude = this.locationService.watchCoordinate.longitude;
        this.postData.accuracy = this.locationService.watchCoordinate.accuracy;
      }else{
        this.postData.latitude = null;
        this.postData.longitude = null;
        this.postData.accuracy = null;
      }
      
      const upload = (await this.apiService.uploadAndDeliver(
        this.photoService.image.webviewPath, this.photoService.image.imageName, this.postData)).subscribe(
          (res: any) => {
                if(res.result){
                  this.feedService.updateDelivery(this.delivery.id, res.delivery.status);
                  this.toastService.presentToast('Delivered successfully!');
                }
              },
              (error:any) => {
                this.toastService.presentToast('No network connection, delivering...');
              }
        );
      
      this.feedService.sendDelivery(this.delivery.id);
      this.modalCtrl.dismiss();

    } catch (error) {
      this.feedService.updateDelivery(this.delivery.id, "IN-PROGRESS");
      this.toastService.presentToast("System error occured!");      
    }

  }

  async addImage() {
    const date = new Date();
    const _subscriber = "subs_" + this.postData.subscriber_id;
    const img_name: string = date.toDateString() + "_" + date.toLocaleTimeString() + "_" + _subscriber + ".jpg";

    this.photoService.addNewToGallery(img_name);
    this.has_image = true;
    this.can_send = true;
  }

}
