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

}
