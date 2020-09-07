import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, Events, ViewController } from 'ionic-angular';
import { User, Api } from '../../providers';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { UtilProvider } from "../../providers/util/util";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  authkey: any = '';
  image: any = '';
  created_at: any = '';
  notificationTime: any = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  token: any = '';
  notificationList: any = [];
  isRideAccepted: boolean = false;
  value: any = '';
  vechicleType: any = '';
  isShow: boolean;
  constructor(public navCtrl: NavController, public events: Events, public viewCtrl: ViewController,
    public storage: Storage, public navParams: NavParams, public api: Api,
    public user: User, public util: UtilProvider) {
    this.storage.get('userData').then(userData => {
      if (userData) {
        this.authkey = userData.Authorization;
        this.image = userData.image;
      }
    });
    this.vechicleType = localStorage.getItem('vehicleType');
    console.log('vechicleType++++++++++++==', this.vechicleType);
  }

  ionViewDidLoad() {
    this.storage.get('token').then(token => {
      this.token = token;
      this.pageNumber = 1;
      this.getAllNotifications(this.pageNumber, true).then(succ => {
      })
    })
  }

  doRefresh(refresher: Refresher) {
    this.pageNumber = 1;
    this.getAllNotifications(this.pageNumber, false).then(succ => {
      // console.log('succ',succ);
      refresher.complete();
    }).catch(err => {
      refresher.complete();
    })
  }

  getAllNotifications(pageNumber, isShowLoader) {
    this.util.presentLoading();
    return new Promise((resolve, reject) => {
      if (isShowLoader) {
        this.util.presentLoadingmsg('Loading..')
      }

      let header = new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": this.authkey,
        "Role": "3"
      })


      let formData = {
        pageNumber: pageNumber,
        pageSize: this.pageSize
      };

      console.log('data', formData);
      this.api.getNotification({ headers: header }, formData).subscribe(res => {
        this.util.dismissLoading();
        let response: any = res;
        console.log('response list notification ===', res);

        if (response['data'] != '') {
          this.isShow = true;
        }
        else {
          this.isShow = false;
        }

        if (isShowLoader) {
          this.util.dismissLoading();
        }
        if (response.status) {
          pageNumber == 1 ? this.notificationList = response.data :
            this.notificationList = [...this.notificationList, ...response.data];

          // this.notificationList = this.notificationList.filter(item=>{
          //   if (this.checkIsToday(parseInt(item.create_dt))){
          //     item.isToday = true;
          //   }else {
          //     item.isToday = false;
          //   }
          //   return item;
          // })
          // console.log('this.notificationList ===',this.notificationList);
          this.pageNumber = this.pageNumber + 1;
          resolve();
        } else {
          reject();
        }
      }, error => {
        console.log(error);
        reject();
        if (isShowLoader) {
          this.util.dismissLoading();
        }
      })
    })
  }

  openNotifications(listdata) {
    console.log('listdata', listdata);
    // setTimeout(() => {
    //   this.navCtrl.setRoot('MenuPage');
    // }, 500)
  }

  acceptRide(listdata) {
    console.log('listdata', listdata.id)
    this.util.presentLoading();
    this.isRideAccepted = true;
    let formData = {
      "request_id": listdata.id,
      "request_type": 5
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

  cancelRide(listdata) {
    this.util.presentLoading();
    let formData = {
      "request_id": listdata.id,
      "request_type": 6
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
