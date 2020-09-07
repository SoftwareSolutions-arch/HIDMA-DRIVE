import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { User, Api } from '../../providers';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilProvider } from "../../providers/util/util";
@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  appLanguage: any = '';
  data: any = '';
  error_messages: {};
  countryCodeList = [];
  countryFlagImage = {};
  private userImageToUpload: any = '';
  userImage: any = '';
  userId: any = '';
  isLoading: boolean = false;
  isSaveData: boolean = true;
  authkey: any = '';
  image: any = '';

  userData: any = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    countryCode: '',
    email: ''
  };
  constructor(public actionSheetCtrl: ActionSheetController, public util: UtilProvider,
    public storage: Storage, public user: User, public navCtrl: NavController, public navParams: NavParams,
    public http: HttpClient, public formBuilder: FormBuilder, public events: Events, public api: Api,
    public viewctrl: ViewController
  ) {
    this.countryFlagImage = "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg";
    this.storage.get('userData').then(userData => {
      if (userData) {
        this.authkey = userData.Authorization;
      }
    });
    this.getUserData();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  ngOnInit() {
    this.getData();
    // this.initTranslate();
  }

  initTranslate() {
    this.storage.get('appLanguage').then(data => {
      this.appLanguage = data;
    });
  }

  getUserData() {
    this.storage.get('userData').then(userData => {
      console.log("userdata", userData);
      let data: any = userData;
      // this.userId = data.id;
      if (data) {
        this.userImage = data.image
        this.userData = {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          mobileNumber: data.mobile,
          // userAddress: data.user_address,
          // gender: data.user_gender ? data.user_gender.toString().toLowerCase() : ''
        };
      }
    });
  }

  openNotifications() {
    this.navCtrl.push('NotificationPage');
  }

  saveAndExit() {
    this.navCtrl.setRoot('HomePage');
  }

  presentActionSheet() {
    let select = 'Choose or take a picture';
    let takePicture = 'Take a picture';
    let choosePicture = 'Choose picture';
    if (this.appLanguage == 'sp') {
      select = 'Elige o toma una foto';
      takePicture = 'Toma una foto';
      choosePicture = 'Elige fotos';
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: select,
      buttons: [
        {
          text: takePicture,
          handler: () => {
            this.util.takePicture().then(data => {
              console.log('image from camera ===>', data);
              this.userImage = data;
              this.userImageToUpload = data;
            });
          }
        },
        {
          text: choosePicture,
          handler: () => {
            this.util.aceesGallery().then(data => {
              console.log('image from gallary ===>', data);
              this.userImage = data;
              this.userImageToUpload = data;
            });
          }
        }
      ]
    });
    actionSheet.present();
  }

  getData() {
    this.http.get('assets/country.json').subscribe(res => {
      this.data = res;
      this.data.forEach(element => {
        this.countryCodeList.push(element);
      });
    });
  }

  getFlagdetails(employee) {
    this.countryFlagImage = employee.flag;
  }

  saveUserData() {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })

    this.isLoading = true;
    this.isSaveData = false;

    let rawData = {
      "first_name": this.userData.firstName,
      "last_name": this.userData.lastName,
      "email": this.userData.email,
      "mobile": this.userData.mobileNumber,
      "image": this.userImageToUpload
    }

    this.api.changeProfileImage(rawData, { headers: header }).subscribe(res => {
      console.log(res, "res");
      this.isLoading = false;
      let response: any = res;
      if (response.status) {
        this.isSaveData = true;
        this.storage.set('userData', response.data).then(() => {
          this.events.publish('profileUpdated', true);
        });
        this.util.presentAlert('Success', 'Profile Updated Successfully');
        setTimeout(() => {
          this.navCtrl.setRoot('MenuPage');
        }, 500)
      }

      else {
        this.isSaveData = true;
        this.util.presentToast(response.message);
      }
    }, error => {
      console.error(error);
      this.isLoading = false;
      this.isSaveData = true;

    })
    // }).catch(err => { });
  }
}
