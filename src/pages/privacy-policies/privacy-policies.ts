import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User,Api } from '../../providers';
import { UtilProvider } from "../../providers/util/util";

@IonicPage()
@Component({
  selector: 'page-privacy-policies',
  templateUrl: 'privacy-policies.html',
})
export class PrivacyPoliciesPage {
  privacyPolicyContent:any='';
  constructor(public navCtrl: NavController,public util: UtilProvider, public navParams: NavParams,public api: Api) {
    this.getPrivacyPolicy();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacyPoliciesPage');
  }

  openNotifications(){
    this.navCtrl.push('NotificationPage');
  }


  getPrivacyPolicy(){
    this.util.presentLoading();
    this.api.getPrivacyDetails().subscribe(res => {
      this.util.dismissLoading();
      let response: any = res;
      if (response['status'] == 1) {
        this.privacyPolicyContent=response.data[0].content
        console.log('response', response.data[0]);
      }
    }, error => {
      console.error(error);
    })
  }
}
