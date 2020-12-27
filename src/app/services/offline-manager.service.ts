import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { FeedService } from 'src/app/services/feed.service';
import { NetworkService, ConnectionStatus } from './network.service';


const STORAGE_REQ_KEY = 'storedreq';
 
interface StoredRequest {
  url: string,
  type: string,
  data: any,
  time: number,
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  constructor(private storage: Storage, private http: HttpClient, private toastService: ToastService,
    private feedService: FeedService, private networkService: NetworkService) { }

  
  checkForEvents(): Observable<any> {
    // if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
    //   this.toastService.presentToast("No network connection, connect to the internet and try again.");
    //   return of(false);
    // }
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap(storedOperations => {
        let storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj).pipe(
            finalize(() => {
              this.toastService.presentToast(`Pending operations successfully delivered!`);
 
              this.storage.remove(STORAGE_REQ_KEY);
            })
          );
        } else {
          this.toastService.presentToast(`No pending operations`);
          return of(false);
        }
      })
    )
  }


  storeRequest(url, type, data) {
 
    this.toastService.presentToast(`Your data is stored locally because you seem to be offline.`);
 
    let action: StoredRequest = {
      url: url,
      type: type,
      data: data,
      time: new Date().getTime(),
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 
    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);
 
      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }
      // Save old & new local transactions back to Storage
      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }


  sendRequests(operations: StoredRequest[]) {
    let obs = [];
 
    for (let op of operations) {
      console.log('Make one request: ', JSON.stringify(op));
      console.log('Data: ', JSON.stringify(op.data));

      const formData = new FormData();
     // const blob = await fetch(op.data.webPath).then(r => r.blob());
      fetch(op.data.webPath).then(r => r.blob().then(
        blob => {
          formData.append('file', blob, op.data.name)
          formData.append('data', JSON.stringify(op.data.data));
          let oneObs = this.http.request(op.type ,op.url, {body: formData}).subscribe(
            (res:any)=>{
              this.feedService.updateDelivery(op.data.data.delivery_id, res.delivery.status);
            },
            (error:any) =>{
              this.toastService.presentToast("System error occured!. Please contact system administrator");      
            }
          );
          obs.push(oneObs);
        }));
    }
 
    // Send out all local events and return once they are finished
    return forkJoin(obs);
  }

}
