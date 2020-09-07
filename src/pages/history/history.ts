import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, User } from '../../providers';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  authkey: any = '';
  historyDetails: any = '';

  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, 
    public api: Api, public user: User) {
    this.storage.get('userData').then(userData => {
      if (userData) {
        this.authkey = userData.Authorization;
        this.getHistoryDetails();
      }
    });
  }
  
  openHistoryDetails(historyItems) {
    this.navCtrl.push('TripDetailsPage', { Pagename: historyItems.id });
  }

  openNotifications() {
    this.navCtrl.push('NotificationPage');
  }

  getHistoryDetails() {
    let formData = {
      "pageNumber": 1,
      "pageSize": '10'
    }

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })
    this.api.getHistoryDetails(formData, { headers: header }).subscribe(res => {
      let response: any = res;
      console.log('res', response);
      if (response.status == "1") {
        this.historyDetails = response['data'];
      }
      else {
        return
      }
    }, error => {
      console.error(error);

    })
  }
}
