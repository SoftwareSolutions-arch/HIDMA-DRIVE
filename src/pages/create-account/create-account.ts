import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Storage } from "@ionic/storage";
import { UtilProvider } from "../../providers/util/util";
import { User } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {

  data: any = '';
  countryCodeList = [];
  countryCode: any = '';
  countryFlagImage = {};
  error_messages: {}
  countryshortName = {};
  isMobilenumberExist: any = '';
  isEmailExist: any = '';
  createForm: FormGroup;
  companyData: any='';
  constructor(public navCtrl: NavController, public storage: Storage, public util: UtilProvider,
    public navParams: NavParams, public viewctrl: ViewController, public http: HttpClient, public formBuilder: FormBuilder,
    public user: User) {
    this.setupLoginFormData();
    this.countryFlagImage = "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg";
  }

  ngOnInit() {
    this.getData();
    this.companyRegistrationNumber();
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
    this.countryCode = flagList.countrycode;
    this.countryshortName = flagList.shortname;
    this.countryFlagImage = flagList.flag;
  }

  setupLoginFormData() {
    this.error_messages = {
      mobileNumber: [
        { type: "required", message: "Mobile Number  is required." },
        { type: "minlength", message: "minimun length should be 9 ." },
        { type: "maxlength", message: "maximum length should be 12 ." }
      ],

      firstName: [
        { type: "required", message: "First Name is required." },
      ],
      lastName: [
        { type: "required", message: "Last Name is required." },
      ],
      countryCode: [
        { type: "required", message: "Country Code is required." },
      ],
      email: [
        { type: "required", message: 'Email is Required' },
        { type: "pattern", message: 'Please Enter valid Email' }
      ],
      homeAddress: [
        { type: "required", message: "Home Address is required." },
      ],
      companyName: [
        { type: "required", message: "Company Name is required." },
      ],
      password: [
        { type: "required", message: 'Password is Required' },
        { type: "minlength", message: '*Minimum length should be 8' },
        { type: "maxlength", message: '*Maximum length should be 12' }
      ],
      driving_licence_no: [
        { type: "required", message: "Driving Licence No. is required." },
      ],
    };
    this.createForm = this.formBuilder.group(
      {
        mobileNumber: new FormControl("", Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(12)])),
        firstName: new FormControl("", Validators.compose([Validators.required])),
        lastName: new FormControl("", Validators.compose([Validators.required])),
        countryCode: new FormControl(""),
        email: new FormControl("", Validators.compose([Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),])),
        homeAddress: new FormControl("", Validators.compose([Validators.required])),
        companyName: new FormControl("", Validators.compose([Validators.required])),
        driving_licence_no: new FormControl("", Validators.compose([Validators.required])),
        lat: new FormControl("", Validators.compose([])),
        long: new FormControl("", Validators.compose([])),
        password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(12)])
        )
      },
    );
    this.createForm.controls.countryCode.setValue('+91');
  }


  backPage() {
    this.viewctrl.dismiss()
  }

  goLoginPage() {
    this.viewctrl.dismiss();
  }

  register() {
    console.log('this.createForm.value', this.createForm.value)
    this.navCtrl.push('PersonalDocumentPage', { Pagename: this.createForm.value });
  }

  termsAndconditions() {
    this.navCtrl.push('TermsConditionsPage');
  }

  privacyPolicy() {
    this.navCtrl.push('PrivacyPoliciesPage');
  }

  verifyMobileNumber() {
    let formData = {
      "type": "2",
      "mobile": this.createForm.value.mobileNumber,
      "email": this.createForm.value.email
    }
    this.user.validate(formData).subscribe(res => {
      let response: any = res;
      if (response) {

        this.isMobilenumberExist = response.message;
        // this.util.presentToast(response.message);
        setTimeout(() => {
          // this.navCtrl.setRoot('MenuPage');
        }, 500)
        return
      }
      else {
        // this.util.presentToast(response.message);
        return
      }
    }, error => {
      console.error(error);
      this.util.presentToast(error.error.message);
    })
  }

  verifyEmailNumber() {
    let formData = {
      "type": "1",
      "mobile": this.createForm.value.mobileNumber,
      "email": this.createForm.value.email
    }
    this.user.validate(formData).subscribe(res => {
      let response: any = res;
      if (response.message == "Email and Mobile Number Is available") {
        this.isEmailExist = response.message;
        return
      }
      else {
        this.isEmailExist = response.message;
        return
      }
    }, error => {
      console.error(error);
      this.util.presentToast(error.error.message);
    })
  }

  companyRegistrationNumber() {
    this.user.getCompanyRegistration().subscribe(res => {
      let response: any = res;
      console.log('response',response.data);
      if (response.status == 1) {
        this.companyData=response.data;
        return
      }
      else {
      }
    }, error => {
      console.error(error);
    })
  }

  getCompanydetails(data) {
    console.log('data',data);
    // this.companyId = data.id;
    localStorage.setItem('companyId',data.id);
  }
}
