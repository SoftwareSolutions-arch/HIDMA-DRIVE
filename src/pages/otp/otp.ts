import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from "../../providers";
import { UtilProvider } from "../../providers/util/util";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  isLoading: boolean = false;
  signUpData: any = {
    full_name: '',
    email: '',
    mobile_no: '',
    password: '',
    Firebase_token: '',
    otp: '',
  };

  otp: any = '';
  value: any = '';
  form: FormGroup;
  formInput = ['input1', 'input2', 'input3', 'input4'];
  @ViewChildren('formRow') rows: any;
  constructor(public navCtrl: NavController,
    public user: User,
    public viewCtrl: ViewController,
    public storage: Storage,
    public util: UtilProvider,
    public navParams: NavParams) {
    this.form = this.toFormGroup(this.formInput);
    this.signUpData = navParams.data.signUpData;

    this.value = navParams.get('Pagename');
    this.setDummyData();
    // console.log(this.value.data.userid);
  }

  setDummyData() {
    this.form.controls.input1.setValue('1');
    this.form.controls.input2.setValue('2');
    this.form.controls.input3.setValue('3');
    this.form.controls.input4.setValue('4');
  }

  toFormGroup(elements) {
    const group: any = {};

    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  keyUpEvent(event, index) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }

  }

  onSubmit() {
    this.isLoading = true;
    let resData = {
      "user_id": this.value.data.userid,
      "otp": this.form.value.input1 + this.form.value.input2 + this.form.value.input3 + this.form.value.input4
    }

    this.user.verifyOtp(resData).subscribe(res => {
      console.log("res", res);
      this.isLoading = false;
      let response: any = res;
      if (response.status == 1) {
        this.util.presentToast(response.message);
        localStorage.setItem('setuserid', this.value.data.userid)
        this.navCtrl.push('ChangePasswordPage');
      }
      else {
        this.util.presentToast(response.message);
      }
    }, error => {
      console.error(error);
      this.util.presentToast(error.error.message);
      this.isLoading = false;
    })
  }

  back() {
    this.viewCtrl.dismiss();
  }

  resendOtp() {
    this.util.presentLoadings('Resending code ...');
    let resData = {
      "user_id": this.value.data.userid,
    }

    this.user.resendOtp(resData).subscribe(res => {
      console.log('response sendOTP ====', res);
      this.util.dismissLoading();
      let response: any = res;
      if (response.status == 1) {
        this.util.presentToast(response.message);
      }
    }, error => {
      console.error(error);
      this.util.dismissLoading();
      this.util.presentToast('Something Went Wrong !!');
    })
  }
}
