import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  options = { headers: this.headers, withCredintials: false };
  
  constructor(private http: HttpClient) {}

  post(serviceName: string, data: any) {

    const url = environment.apiUrl + serviceName;

    return this.http.post(url, JSON.stringify(data), this.options);
  }

  get(serviceName: string){
    const url = environment.apiUrl + serviceName;

    return this.http.get(url, this.options);
  }

  uploadImage(blobData, name, ext) {
    const url = environment.apiUrl + "image-upload";

    const formData = new FormData();
    formData.append('file', blobData, `myimage.${ext}`);
    formData.append('name', name);
    
    return this.http.post(url, formData);
  }
}
