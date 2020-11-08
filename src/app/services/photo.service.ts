import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';


const { Camera } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public images: Image[] = [];
  loading: any;

  constructor(private http: HttpClient, private toastService: ToastService, private loadingController: LoadingController) { }

  public async addNewToGallery(img_name: string) {
    const image = await Camera.getPhoto({
      quality: 60,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    }).then(img =>{
      const imageName = img_name;

      // Remove existing image in array
      this.images = [];

      this.images.unshift({
        imageName: imageName,
        webviewPath: img.webPath,
        imageFormat: img.format,
      });
    });
  }

  async upload(webPath: string, name: string , delivery_id: string): Promise<void> {
    this.loading = await this.loadingController.create({
      message: 'Uploading image, please wait...',
    });
    
    this.loading.present();

    const url = environment.apiUrl + "bds/api/image-upload";

    const blob = await fetch(webPath).then(r => r.blob());

    const formData = new FormData();
    formData.append('file', blob, name);
    formData.append('delivery_id', delivery_id);

    this.http.post<boolean>(url, formData).subscribe(
      ok => {
        this.loading.dismiss();
        this.toastService.presentToast('Delivered Successfully!');
      });
  }
}


export interface Image {
  imageName: string;
  // blobData: any;
  imageFormat: any;
  webviewPath: string;
}