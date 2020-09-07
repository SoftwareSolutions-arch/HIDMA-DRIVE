import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  laguage: any = '';
  value: any = '';

  constructor(public actionSheetCtrl: ActionSheetController, public events: Events, public storage: Storage, private translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    storage.get('appLanguage').then(data => {
      if (data) {
        this.translate.setDefaultLang(data);
        this.translate.use(data);
        this.laguage = data;
      } else {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.laguage = 'en';
      }
    })
    this.value = localStorage.getItem('vehicleType');
  }

  changeLanguage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Change Language',
      cssClass: 'custom-modal',
      buttons: [
        {
          text: 'English',
          handler: () => {
            console.log("inside english language");
            this.translate.use('en');
            this.storage.set('appLanguage', 'en').then(() => {
              this.events.publish('appLanguage', 'en');
            });
          }

        },
        {
          text: 'Spanish',
          handler: () => {
            console.log("inside Spanish language");
            this.translate.use('sp');
            this.storage.set('appLanguage', 'sp').then(() => {
              this.events.publish('appLanguage', 'sp');
            });
          }
        }
      ]
    });
    actionSheet.present();
  }

  // myProfile(){
  //   this.navCtrl.push('MyAccountPage');
  // }

  // changeVehicle(){
  //   this.navCtrl.push('ChangeVehiclePage');
  // }

  changeRoute() {
    var istrip = localStorage.getItem('isTripStarted')
    console.log('istrip', istrip)
    this.navCtrl.push('ChangeRoutePage');
  }

  // termsAndcondition(){
  //   this.navCtrl.push('TermsConditionsPage');
  // }

  // privacyPolicy(){
  //   this.navCtrl.push('PrivacyPoliciesPage');
  // }

  // about(){
  //   this.navCtrl.push('AboutPage');
  // }

  // openNotifications(){
  //   this.navCtrl.push('NotificationPage');
  // }

  openPage(page) {
    this.navCtrl.push(page);
  }
}
