import { Injectable, NgZone } from '@angular/core';
import { CallbackID, Capacitor, Plugins } from "@capacitor/core";
import { ToastService } from './toast.service';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  watchCoordinate: any;
  watchID: CallbackID;

  constructor(private zone: NgZone, private toastService: ToastService) {
    this.watchPosition();
  }

  watchPosition() {
    try {
      this.watchID = Plugins.Geolocation.watchPosition({enableHighAccuracy: true}, (position, err) => {
        this.zone.run(() => {
          console.log(position);
          if(!(position == null)){
            this.watchCoordinate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            };
          }
        });
      });
    } catch (e) {
        this.toastService.presentToast(e);
    }
  }


  clearWatch() {
    if (this.watchID != null) {
      Plugins.Geolocation.clearWatch({ id: this.watchID });
    }
  }
  
}
