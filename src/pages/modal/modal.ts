import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { User, Api } from '../../providers';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilProvider } from "../../providers/util/util";
import { Storage } from "@ionic/storage";
import { Events } from "ionic-angular/index";


@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  value: any = '';
  authkey: any = '';
  isRideAccepted: boolean = false;

  constructor(public user: User, public api: Api, public viewCtrl: ViewController,
    public storage: Storage,
    public util: UtilProvider,
    public events: Events,
    public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
    this.value = navParams.get('Pagename');
    console.log('this.value', JSON.stringify(this.value));
    this.storage.get('userData').then(userData => {
      if (userData) {
        this.authkey = userData.Authorization
      }
    });
  }

  ionViewDidLoad() {
    setTimeout(() => {
      if (!this.isRideAccepted) {
        this.cancelRide();
      }
    }, 15000)
  }
  acceptRide() {
    this.util.presentLoading();
    this.isRideAccepted = true;
    let formData = {
      "request_id": this.value.booking_request_id,
      "request_type": 1
    }

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey
    })

    this.api.acceptBooking({ headers: header }, formData).subscribe(res => {
      this.util.dismissLoading()
      let response: any = res;
      console.log('response', response);
      if (response.status == "1") {
        this.util.presentToast(response.message);
        this.storage.set('acceptBooking', this.value).then(succ => {
          this.events.publish('rideAccepted');
        });
        this.viewCtrl.dismiss();
      } else {
        this.util.presentToast(response.message);
      }
    }, error => {
      console.error(error);
      this.util.presentToast(error.error.message);
    })
  }

  cancelRide() {
    this.util.presentLoading();
    let formData = {
      "request_id": this.value.booking_request_id,
      "request_type": 2
    }

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey
    })
    this.api.acceptBooking({ headers: header }, formData).subscribe(res => {
      this.util.dismissLoading();
      let response: any = res;
      console.log('response', response);
      this.viewCtrl.dismiss();
      if (response.status == "1") {
        this.util.presentToast(response.message);
        return
      }
      else {
        this.util.presentToast(response.message);
        return
      }
    }, error => {
      console.error(error);
      this.util.presentToast(error.error.message);
    })
  }
}
