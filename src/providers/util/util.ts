import { Injectable } from '@angular/core';
import {
    LoadingController, ToastController,
    Loading, ModalController, AlertController, Platform
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Camera } from "@ionic-native/camera";
import { User } from "../../providers";

@Injectable()
export class UtilProvider {
    title: string = '';
    selectaddress: string = '';
    oktext: string = '';
    loading: Loading;
    please_wait: any;
    smallAlert: any;

    constructor(private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private alertCtrl: AlertController, public user: User,
                public modalController: ModalController,
                public platform: Platform, private camera: Camera, private translate: TranslateService,
    ) {

        this.translate.get("PLEASE_WAIT").subscribe(values => {
            this.please_wait = values;
        });
    }

    presentLoading() {
        this.translate.get("PLEASE_WAIT").subscribe(values => {
            this.please_wait = values;
        });
        this.loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: this.please_wait,
            // duration: 3000
        });

        this.loading.onDidDismiss(() => {
        });
        this.loading.present();

    }

    presentLoadingmsg(msg) {
        if (this.loading){
          this.dismissLoading();
        }else{
          this.loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: msg,
            // duration: 6000
          });
          this.loading.present();
        }
      }

    presentLoadings(msg) {
        if (this.loading) {
            this.dismissLoading();
        } else {
            this.loading = this.loadingCtrl.create({
                spinner: 'bubbles',
                content: msg,
                duration: 6000
            });
            this.loading.present();
        }
    }

    dismissLoading() {
        if (this.loading) {
            this.loading.dismiss();
        }
    }
    //FOR PRESENT TOAST
    presentToast(message) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
    //FOR BASIC TOAST
    presentCustomToast(message) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'bottom',
            cssClass: 'dark-trans',
            closeButtonText: 'OK',
            showCloseButton: true
        });
        toast.present();
    }
    //FOR ERROR TOAST
    presentErrorToast(message) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'bottom',
            cssClass: 'error-toast',
            closeButtonText: 'OK',
            showCloseButton: true
        });
        toast.present();
    }

    //FOR DATA NOT FOUND ERROR
    presentAlertData() {
        let alert = this.alertCtrl.create({
            title: 'Data not found',
            subTitle: 'Something went wrong',
            cssClass: 'alertDanger',
            buttons: [
                {
                    text: 'Try Again!',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                        this.presentErrorToast('No result found');
                    }
                }
            ]
        });
        alert.present();
    }
    //FOR BASIC SERVER ERROR
    presentAlert(title, msg) {
        if (!this.smallAlert){
            this.smallAlert = this.alertCtrl.create({
                title: title,
                subTitle: msg,
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        this.smallAlert = null;
                    }
                }]
            });
            this.smallAlert.present();
        }
    }

    //FOR CONFIRM NETWORK ERROR
    presentNetwork() {
        let alert = this.alertCtrl.create({
            title: 'Network Error',
            message: 'Internet not connected please try again.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        console.log('Ok clicked');
                        //this.navCtrl.push(HomePage);
                    }
                }
            ]
        });
        alert.present();
    }

    //FOR CONFIRM NETWORK ERROR
    presentAlerts() {
        let alert = this.alertCtrl.create({
            title: 'Are You Sure',
            message: 'Do You want to start the trip.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                        return
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        console.log('Ok clicked');
                        //this.navCtrl.push(HomePage);
                    }
                }
            ]
        });
        alert.present();
    }


    //FOR CONFIRM NETWORK ERROR
    presenttripAlert() {
        let alert = this.alertCtrl.create({
            title: 'Are You Sure',
            message: 'Do You want to accept the trip.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                        return
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        console.log('Ok clicked');
                        //this.navCtrl.push(HomePage);
                    }
                }
            ]
        });
        alert.present();
    }

    // take picture from camera
    takePicture() {
        // this.backgroundMode.enable();
        return new Promise((resolve, reject) => {
            this.camera.getPicture({
                quality: 70,
                correctOrientation: true,
                sourceType: this.camera.PictureSourceType.CAMERA,
                destinationType: this.camera.DestinationType.DATA_URL
                // destinationType: this.camera.DestinationType.FILE_URI
            }).then((imageData) => {
                // this.backgroundMode.disable();
                resolve('data:image/png;base64,' + imageData)
            }, (err) => {
                // this.backgroundMode.disable();
                reject(err);
            });
        })
    }

    // access gallery method
    aceesGallery() {
        // this.backgroundMode.enable();
        return new Promise((resolve, reject) => {
            this.camera.getPicture({
                quality: 70,
                sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
                destinationType: this.camera.DestinationType.DATA_URL
                // destinationType: this.camera.DestinationType.FILE_URI
            }).then((imageData) => {
                // this.backgroundMode.disable();
                resolve('data:image/png;base64,' + imageData)
            }, (err) => {
                // this.backgroundMode.disable();
                reject(err);
            });
        });
    }
}
