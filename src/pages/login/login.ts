import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { UtilProvider } from "../../providers/util/util";
import { User } from '../../providers';
import { Storage } from "@ionic/storage";
import { Config, Nav, Platform, Events, AlertController, ModalController } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  data: any;
  Employee: any
  isLoading: boolean = false;
  loginDisabled: boolean = false;
  countryCodeList = [];
  countryFlagImage = {};
  countryshortName = {};
  error_messages: any = {};
  getSessionid: any = '';
  firebaseToken: any = '';
  constructor(public http: HttpClient, private localNotifications: LocalNotifications, private fcm: FCM,
    public user: User, platform: Platform, public modalCtrl: ModalController,
    public storage: Storage,
    public util: UtilProvider,
    public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.setupLoginFormData();
    this.countryFlagImage = "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg";
    this.getSessionid = localStorage.getItem('sessionid');

    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.fcm.getToken().then(token => {
          console.log('"token"', token);
          this.firebaseToken = token;
        });
      }
    });
    this.getData();
  }

  setupLoginFormData() {
    this.error_messages = {
      mobileNumber: [
        { type: "required", message: "Mobile Number  is required." },
        { type: "minlength", message: "Mobile Number Should Be 9-12 Digit ." },
        { type: "maxlength", message: "Mobile Number Should Be 9-12 Digit ." }
      ],

      password: [
        { type: "required", message: 'Password is Required' }
      ]
    };
    this.loginForm = this.formBuilder.group(
      {
        mobileNumber: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(12)
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
        countryCode: new FormControl("")
      },
    );
  }

  openSignUpPage() {
    this.getSessionid = localStorage.getItem('sessionid');
    if (this.getSessionid == 1) {
      this.navCtrl.push('AddVehiclePage');
    }
    else {
      this.navCtrl.push('CreateAccountPage');
    }
  }

  doLogin() {
    // var firebaseToken=localStorage.getItem('firebaseToken');
    console.log('firebaseToken', this.firebaseToken)
    // this.storage.get('firebaseToken').then(userData => {
    // console.log('userData',userData)
    this.isLoading = true;
    this.loginDisabled = true;

    let formData = {
      "mobile": this.loginForm.value.mobileNumber,
      "password": this.loginForm.value.password,
      "firebase_token": this.firebaseToken
    }
    this.user.login(formData).subscribe(res => {
      localStorage.setItem('isLogin', '1');
      this.loginDisabled = false;
      let response: any = res;
      console.log('response', response);
      if (response.status == "1") {
        this.isLoading = false;
        this.util.presentToast(response.message);
        this.storage.set('userData', response.data);
        this.storage.set('vehicle_details', response.data.vehicle_id);
        setTimeout(() => {
          localStorage.setItem('vehicleType', response.data.vehicle_type)
          this.navCtrl.setRoot('MenuPage');
        }, 500)
        return
      }
      else {
        this.isLoading = false;
        this.util.presentToast(response.message);
        return
      }
    }, error => {
      console.error(error);
      this.isLoading = false;
      this.util.presentToast(error.error.message);
    })
    // })
  }

  openForgotPassord() {
    this.navCtrl.push('ForgetPasswordPage');
  }

  getData() {
    this.http.get('assets/country.json').subscribe(res => {
      this.data = res;
      this.data.forEach(element => {
        this.countryCodeList.push(element);
      });
    });
  }

  getFlagdetails(flagList) {
    this.countryshortName = flagList.shortname;
    this.countryFlagImage = flagList.flag;
  }

  onChange(event) {
    event = this.countryshortName;
  }
}
