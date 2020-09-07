import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, Platform, MenuController, NavParams, ViewController } from 'ionic-angular';
import { UtilProvider } from "../../providers/util/util";
import { Storage } from "@ionic/storage";
import { HttpHeaders } from '@angular/common/http';
import { Api } from '../../providers/api/api';

/**
 * Generated class for the MyAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {
  userData: any = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    countryCode: '',
    email: ''
  };

  authkey: any = '';
  constructor(public navCtrl: NavController, public storage: Storage, public util: UtilProvider,
    public navParams: NavParams, public api: Api, public viewCtrl: ViewController, public menuCtrl: MenuController,) {
    this.getUserData();
    // this.authkey = localStorage.getItem('AuthorizationKey');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyAccountPage');
  }


  getUserData() {
    this.storage.get('userData').then(userData => {
      console.log("userdata++000", userData);
      let data: any = userData;
      if (data) {
        this.userData = {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          user_address: data.user_address,
          mobile: data.mobile,
          image:data.image,
          authkey:data.Authorization
        };
      };
    })
  }

  back() {
    this.viewCtrl.dismiss();
  }

  editProfile() {
    this.navCtrl.push('EditProfilePage');
  }


  logOut() {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.userData.authkey
    })
    this.api.onlogout({ headers: header }).subscribe(res => {
      console.log('response login ====', res);
      let response: any = res;
      if (response.status == "1") {
        setTimeout(() => {
          this.menuCtrl.close();
          localStorage.clear();
          this.storage.clear();
          this.util.presentAlert('Success', response['message']);
          this.navCtrl.setRoot('LoginPage');
        }, 500)
        return
      }
      else {
        // this.util.presentToast(response.message);
        return
      }
    }, error => {
      console.error(error);
      // this.util.presentToast(error.message);
    })

  }

}
