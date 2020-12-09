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
  public image: Image;
  loading: any;

  constructor(private http: HttpClient, private toastService: ToastService, private loadingController: LoadingController) { }

  public async addNewToGallery(img_name: string) {
    const image = await Camera.getPhoto({
      quality: 40,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      saveToGallery: false,
    }).then(img =>{
      const imageName = img_name;

      this.image= {
        imageName: imageName,
        webviewPath: img.webPath,
        imageFormat: img.format,
      }
    });
  }

  async upload(webPath: string, name: string , data: any) {

    const url = environment.apiUrl + "bds/api/confirm-deliver";

    const blob = await fetch(webPath).then(r => r.blob());

    const formData = new FormData();
    formData.append('file', blob, name);
    formData.append('data', JSON.stringify(data));

    return this.http.post(url, formData);
  }
}


export interface Image {
  imageName: string;
  imageFormat: any;
  webviewPath: string;
}