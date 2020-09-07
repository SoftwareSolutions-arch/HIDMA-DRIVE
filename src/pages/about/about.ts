import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User,Api } from '../../providers';
import { Storage } from "@ionic/storage";
import { UtilProvider } from '../../providers/util/util';


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  aboutContent:any='';
  constructor(public navCtrl: NavController,public util: UtilProvider, public navParams: NavParams, public api: Api,public storage: Storage) {
    this.getAboutUs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }


  openNotifications(){
    this.navCtrl.push('NotificationPage');
  }

  getAboutUs(){
    this.util.presentLoading();
    this.api.getAboutDetails().subscribe(res => {
      this.util.dismissLoading();
      let response: any = res;
      if (response['status'] == 1) {
        this.aboutContent=response.data[0].content
        console.log('response', response.data[0].content);
    
      }

    }, error => {
      console.error(error);
    })
  }
}
