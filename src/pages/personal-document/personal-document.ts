import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilProvider } from "../../providers/util/util";
import { User } from '../../providers';
import { Storage } from "@ionic/storage";
import { Geolocation } from '@ionic-native/geolocation';


@IonicPage()
@Component({
  selector: 'page-personal-document',
  templateUrl: 'personal-document.html',
})
export class PersonalDocumentPage {
  isbirthUpload: any = '';
  isdrivingUpload: any = '';
  ispassportUpload: any = '';
  isElectionUpload: any = '';
  value: any = '';
  imageData: any;
  capturedImage: any = '';
  currentImage: any = '';
  birthfile: any = '';
  drivingfile: any = '';
  passportfile: any = '';
  electionfile: any = '';
  lat: any = '';
  long: any = '';
  companyId: any = '';

  constructor(
    public navCtrl: NavController, private geolocation: Geolocation, public storage: Storage, public navParams: NavParams, public util: UtilProvider,
    public user: User
  ) {
    this.value = navParams.get('Pagename');
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.lat = data.coords.latitude;
      this.long = data.coords.longitude;
    });

    this.companyId = localStorage.getItem('companyId');
  }

  ionViewDidLoad() {
  }

  termsAndconditions() {
    this.navCtrl.push('TermsConditionsPage');
  }

  privacyPolicy() {
    this.navCtrl.push('PrivacyPoliciesPage');
  }

  birthCertificate(event) {
    this.isbirthUpload = event.target.files[0];
    const file = event.target.files[0];
    const reader = new FileReader();
    this.birthfile = file;
    return
  };

  drivingCertificate(event) {
    this.isdrivingUpload = event.target.files[0];
    const file = event.target.files[0];
    const reader = new FileReader();
    this.drivingfile = file;
  };

  passportCertificate(event) {
    this.ispassportUpload = event.target.files[0];
    const file = event.target.files[0];
    const reader = new FileReader();
    this.passportfile = file;
  };

  electionCertificate(event) {
    this.isElectionUpload = event.target.files[0];
    const file = event.target.files[0];
    const reader = new FileReader();
    this.electionfile = file;
  };

  next() {
    if (this.birthfile == '') {
      this.util.presentToast("please insert all images");
      return;
    }

    if (this.passportfile == '') {
      this.util.presentToast("please insert all images");
      return;
    }

    if (this.drivingfile == '') {
      this.util.presentToast("please insert all images");
      return;
    }

    if (this.electionfile == '') {
      this.util.presentToast("please insert all images");
      return;
    }

    let formData = new FormData();
    formData.append('first_name', this.value.firstName);
    formData.append('last_name', this.value.lastName);
    formData.append('email', this.value.email);
    formData.append('mobile', this.value.mobileNumber);
    formData.append('password', this.value.password);
    formData.append('country_code', this.value.countryCode);
    formData.append('address', this.value.homeAddress);
    formData.append('driving_licence_number', this.value.driving_licence_no);
    formData.append('birth_certificate', this.birthfile);
    formData.append('driving_licence', this.drivingfile);
    formData.append('passport', this.passportfile);
    formData.append('election_card', this.electionfile);
    formData.append('company_id', this.companyId);
    formData.append('lat', this.lat);
    formData.append('lang', this.long);
    this.util.presentLoading();
    this.user.uploadUserdata(formData).subscribe(res => {
      let response: any = res;
      if (response['status'] == 1) {
        console.log('response', response);
        this.storage.set('personalData', response['data']).then(() => {
          this.util.presentToast(response['message']);
          this.util.dismissLoading();
          this.navCtrl.setRoot('AddVehiclePage');
        });
        localStorage.setItem('sessionid', "1")
      }

      else {
        localStorage.setItem('sessionid', "0")
        this.util.dismissLoading();
        this.util.presentToast(response['message']);
        return;
      }
    }, error => {
      console.error(error);
    })
  }

  deleteBirthImage() {
    this.isbirthUpload = '';
    this.birthfile = '';
    return
  }
  deleteDrivingImage() {
    this.isdrivingUpload = '';
    this.drivingfile = '';
    return
  }
  deletePassportImage() {
    this.ispassportUpload = '';
    this.passportfile = '';
    return
  }
  deleteElectionImage() {
    this.isElectionUpload = '';
    this.electionfile = '';
    return
  }
}
