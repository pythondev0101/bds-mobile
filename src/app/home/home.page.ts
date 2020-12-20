import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  isAdmin: boolean;


  constructor(private storageService: StorageService) {
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storageService.get('userData').then(
      data => {
        this.isAdmin = data.is_admin;
      }
    )
  }

}
