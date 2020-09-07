import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, Events, AlertController, ModalController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { UtilProvider } from "../providers/util/util";
@Component({
  template: `<ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = '';
  @ViewChild(Nav) nav: Nav;
  constructor(private translate: TranslateService,
    private localNotifications: LocalNotifications,
    private fcm: FCM,
    private util: UtilProvider,
    public storage: Storage, platform: Platform, public events: Events, public modalCtrl: ModalController,
    private alertCtrl: AlertController, private config: Config, private statusBar: StatusBar,
    private backgroundMode: BackgroundMode,
    private splashScreen: SplashScreen) {
    // this.backgroundMode.enable();
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            console.log("Received in background", data);
            this.localNotifications.schedule({
              sound: 'file://src/assets/media/beeps_notification.mp3'
            })
          } else {
            console.log("Received in foreground", data);
            this.localNotifications.schedule({
              title: data.title,
              text: data.body,
              sound: 'file://src/assets/media/beeps_notification.mp3'
            });
          }
          if (data.types == 7 || data.types == '7') {
            this.util.presentAlert('Arrived at Location', 'You can now start the Trip');
            this.events.publish('reachAtLocation', true);
          }
          if (data.types == 4) {
            let profileModal = this.modalCtrl.create('ModalPage', { Pagename: JSON.parse(data.book_request_info) });
            profileModal.present();
            profileModal.onDidDismiss(data => {
              // this.rootPage = 'MenuPage';
            })
          }
        })
      }
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      storage.get('userData').then(data => {
        if (data) {
          this.rootPage = 'MenuPage';
        } else {
          this.rootPage = 'LoginPage'
        }
      });
    });
    events.subscribe('appLanguage', (value) => {
      this.initTranslate();
    });
    this.initTranslate();
  }

  initTranslate() {
    this.storage.get('appLanguage').then(data => {
      if (data && data == 'sp') {
        this.translate.setDefaultLang('sp');
        this.translate.use('sp');
      } else {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
      }
      this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
        this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
      });
    });

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }
}
