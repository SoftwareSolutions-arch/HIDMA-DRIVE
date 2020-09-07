import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilProvider } from '../../providers/util/util';
import { User } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
  forgetForm: FormGroup;
  error_messages: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController,
    public util: UtilProvider, public user: User,
    public formBuilder: FormBuilder) {
    this.setupLoginFormData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
  }

  setupLoginFormData() {
    this.error_messages = {
      mobile_number: [
        { type: "required", message: "Mobile Number  is required." },
        { type: "minlength", message: "minimun length should be 10 ." },
        { type: "maxlength", message: "maximum length should be 12 ." }
      ],
    };
    this.forgetForm = this.formBuilder.group(
      {
        mobile_number: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(12)
          ])
        ),
      },
    );
  }

  loginNow() {
    this.viewctrl.dismiss();
  }

  forgetpassword() {
    let formValues = {
      "mobile": this.forgetForm.value.mobile_number
    }
    this.user.forgetPassword(formValues).subscribe(res => {
      console.log('response login ====', res);
      let response: any = res;
      // if (response) {
      //   this.util.presentToast(response.message);
      //   setTimeout(() => {
      //     this.navCtrl.push('OtpPage');
      //   }, 500)
      //   return
      // }

      if (response['status'] == 1) {
        this.util.presentToast(response.message);
        setTimeout(() => {
          this.navCtrl.push('OtpPage',{ Pagename:res });
        }, 500)
        return
      }

      else{
        this.util.presentToast(response.message);
      }
    }, error => {
      console.error(error);
      this.util.presentToast(error.error.message);
    })
  }

  termsAndconditions() {
    this.navCtrl.push('TermsConditionsPage');
  }

  privacyPolicy() {
    this.navCtrl.push('PrivacyPoliciesPage');
  }
}
