import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilProvider } from '../../providers/util/util';
import { User } from '../../providers';
import { Storage } from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-vehicle-document',
  templateUrl: 'vehicle-document.html',
})
export class VehicleDocumentPage {
  rCfiledetails: any = '';
  inSurancefiledetails: any = '';
  ownerfiledetails: any = '';
  pucfiledetails: any = '';
  isRCUpload: any = '';
  isInsuranceUpload: any = '';
  isownerUpload: any = '';
  isPUCUpload: any = '';
  userid: any = '';
  isLoading: boolean = false;
  isLogin: any = '';

  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, public util: UtilProvider, public user: User) {
    this.storage.get('vehicle_details').then(userData => {
      console.log('userData', userData)
      this.userid = userData;
    })

    this.isLogin = localStorage.getItem('isLogin');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VehicleDocumentPage');
  }

  RcCertificate(event) {
    this.isRCUpload = event.target.files[0];
    const file = event.target.files[0];
    this.rCfiledetails = file
  }

  inSuranceCertificate(event) {
    this.isInsuranceUpload = event.target.files[0];
    const file = event.target.files[0];
    this.inSurancefiledetails = file
  }

  ownerCertificate(event) {
    this.isownerUpload = event.target.files[0];
    const file = event.target.files[0];
    this.ownerfiledetails = file
  }

  pucCertificate(event) {
    this.isPUCUpload = event.target.files[0];
    const file = event.target.files[0];
    this.pucfiledetails = file
  }

  next() {
    if (this.rCfiledetails == '') {
      this.isLoading = true;
      this.util.presentToast("please insert all images");
      return;
    }

    if (this.inSurancefiledetails == '') {
      this.util.presentToast("please insert all images");
      return;
    }

    if (this.ownerfiledetails == '') {
      this.util.presentToast("please insert all images");
      return;
    }

    if (this.pucfiledetails == '') {
      this.util.presentToast("please insert all images");
      return;
    }

    let formData = new FormData();
    formData.append('vehicle_id', this.userid);
    formData.append('rc_book', this.rCfiledetails);
    formData.append('insurance_policy', this.inSurancefiledetails);
    formData.append('owner_certificate', this.ownerfiledetails);
    formData.append('puc', this.pucfiledetails);
    this.util.presentLoading();
    this.user.uploadVehicledata(formData).subscribe(res => {
      let response: any = res;
      if (response.status) {
        console.log(response);
        this.util.dismissLoading();
        // this.navCtrl.setRoot('LoginPage');
        if (this.isLogin == 1) {
          this.navCtrl.setRoot('MenuPage');
        } else {
          this.util.presentAlert('Success', 'you account has been created , you need to wait until your document will verifiy');
          this.util.presentToast(response['message']);
          localStorage.setItem('sessionid', "0");
          this.navCtrl.setRoot('LoginPage');
        }
      }
      else {
        this.util.dismissLoading();
        this.util.presentToast(response['message']);
        console.log('res', response);
        return;
      }
    }, error => {
      console.error(error);
    })
  }

  deleteRcImage() {
    this.isRCUpload = '';
    this.rCfiledetails = '';
    return
  }
  deleteInsuranceImage() {
    this.isInsuranceUpload = '';
    this.inSurancefiledetails = '';
    return
  }
  deleteOwnerImage() {
    this.isownerUpload = '';
    this.ownerfiledetails = '';
    return
  }
  deletePucImage() {
    this.isPUCUpload = '';
    this.pucfiledetails = '';
    return
  }
}
