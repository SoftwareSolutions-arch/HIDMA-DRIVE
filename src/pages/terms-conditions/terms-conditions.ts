import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User,Api } from '../../providers';
import { UtilProvider } from "../../providers/util/util";

@IonicPage()
@Component({
  selector: 'page-terms-conditions',
  templateUrl: 'terms-conditions.html',
})
export class TermsConditionsPage {
  termsAndConditionContent='';
  constructor(public navCtrl: NavController,  public util: UtilProvider, public navParams: NavParams,public api: Api) {
    this.getTermsandConditions();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsConditionsPage');
  }


  openNotifications(){
    this.navCtrl.push('NotificationPage');
  }


  getTermsandConditions(){
    this.util.presentLoading();
    this.api.getTermsandConditions().subscribe(res => {
      this.util.dismissLoading();
      let response: any = res;
      if (response['status'] == 1) {
        this.termsAndConditionContent=response.data[0].content
        console.log('response', response.data[0]);
      }

    }, error => {
      console.error(error);
    })
  }
}
