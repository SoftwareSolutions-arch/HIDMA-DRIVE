import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, Platform, MenuController, Events, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers';
import { HttpHeaders } from '@angular/common/http';
import { Api } from '../../providers/api/api';
import { UtilProvider } from '../../providers/util/util';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = '';
  laguage: any;
  appLanguage: any;
  value: any = '';
  userFirstname: any = '';
  userLastname: any = '';
  image: any = '';
  authkey: any = '';
  userData: any = '';
  vehicleId: any = '';

  constructor(public navCtrl: NavController, public events: Events,
    public storage: Storage, public user: User,
    public platform: Platform, public menuCtrl: MenuController,
    public api: Api, public util: UtilProvider,
    public navParams: NavParams) {
    events.subscribe('profileUpdated', (value) => {
      this.getUserData();
    });
    this.getUserData();
    this.value = localStorage.getItem('vehicleType');
    console.log(' this.value++p', this.value)
    if (this.value == '1' || this.value == 1) {
      this.rootPage = 'HomePage';
    } else {
      this.rootPage = 'HomeTaxiPage'
    }
  }

  ngOnInit() {
    this.initTranslate();
  }

  getUserData() {
    this.storage.get('userData').then(userData => {
      if (userData) {
        this.userFirstname = userData.first_name;
        this.userLastname = userData.last_name;
        this.image = userData.image
        this.authkey = userData.Authorization
      }
    });
  }

  initTranslate() {
    this.storage.get('appLanguage').then(data => {
      this.appLanguage = data;
    });
  }

  openHomePage() {
    if (this.value == '1' || this.value == 1) {
      this.nav.setRoot('HomePage');
    } else {
      this.nav.setRoot('HomeTaxiPage');
    }
  }

  openPage(page) {
    this.nav.setRoot(page);
  }

  logout() {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey
    })
    this.api.onlogout({ headers: header }).subscribe(res => {
      let response: any = res;
      if (response.status == "1") {
        setTimeout(() => {
          this.menuCtrl.close();
          localStorage.clear();
          this.storage.clear();
          this.util.presentAlert('Success', response['message']);
          this.navCtrl.setRoot('LoginPage');
        }, 500)
      }
    }, error => {
      console.error(error);
    })
  }

  createRoute() {
    this.storage.get('routeDetails').then(routeDetails => {
      if (routeDetails != null) {
        this.util.presentToast('Route is already created you can update it from inside the settings');
      } else {
        this.nav.push('CreateRoutePage')
      }
    })
  }
}
