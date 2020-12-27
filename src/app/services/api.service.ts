import { OfflineManagerService } from './offline-manager.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { FeedService } from './feed.service';

const API_STORAGE_KEY = 'specialkey';
const API_URL = 'https://reqres.in/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private networkService: NetworkService, private storage: Storage, private offlineManager: OfflineManagerService,
    private feedService: FeedService) { }

  getUsers(forceRefresh: boolean = false): Observable<any[]> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      return from(this.getLocalData('users'));
    } else {
      // Just to get some "random" data
      let page = Math.floor(Math.random() * Math.floor(6));
      
      // Return real API data and store it locally
      return this.http.get(`${API_URL}/users?per_page=2&page=${page}`).pipe(
        map(res => res['data']),
        tap(res => {
          this.setLocalData('users', res);
        })
      )
    }
  }


  updateUser(user, data): Observable<any> {
    let url = `${API_URL}/users/${user}`;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(url, 'PUT', data));
    } else {
      return this.http.put(url, data).pipe(
        catchError(err => {
          this.offlineManager.storeRequest(url, 'PUT', data);
          throw new Error(err);
        })
      );
    }
  }

  async uploadAndDeliver(webPath: string, name: string , data: any){
    const url = environment.apiUrl + "bds/api/confirm-deliver";
    const blob = await fetch(webPath).then(r => r.blob());
    const formData = new FormData();
    let storedData = {
      'data': data,
      'webPath': webPath,
      'name': name
      }

    formData.append('file', blob, name);
    formData.append('data', JSON.stringify(data));
    
    console.log('test',storedData);
    console.log('test',JSON.stringify(storedData));

    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      this.feedService.updateDelivery(data.id, "DELIVERING");
      return from(this.offlineManager.storeRequest(url, 'POST', storedData));
    } else {
      return this.http.post(url, formData).pipe(
        catchError(err => {
          this.feedService.updateDelivery(data.id, "DELIVERING");
          this.offlineManager.storeRequest(url, 'POST', storedData);
          throw new Error(err);
        })
      );
    }

  }

    // Save result of API requests
  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }
 

  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }

}