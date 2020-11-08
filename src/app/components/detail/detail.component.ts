import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { ToastService } from 'src/app/services/toast.service';

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

  constructor(private modalCtrl: ModalController, private toastService: ToastService, private httpService: HttpService,
    private router: Router, private loadingController: LoadingController) {

  }



  dismissModal(){
    this.modalCtrl.dismiss();
  }

  deliver(sub_id){
    this.router.navigate(['/home/camera', { value: sub_id }]);
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
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
          console.log(this.subscriber);
          this.data.fname = this.subscriber.fname;
          this.data.lname = this.subscriber.lname
          this.data.address = this.subscriber.address;
          this.data.email = this.subscriber.email
          this.data.status = this.subscriber.status;

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
}
