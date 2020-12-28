import { Injectable } from '@angular/core';
import { Plugins, NetworkStatus, PluginListenerHandle } from '@capacitor/core';

const { Network } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NetworkListenerService {

  networkStatus: NetworkStatus;
  networkListener: PluginListenerHandle;
  
  constructor() { }

}
