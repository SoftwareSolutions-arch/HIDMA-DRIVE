import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from "@angular/forms";
import { User } from '../../providers';
import { UtilProvider } from '../../providers/util/util';


@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  changePasswordForm: FormGroup;
  isLoading: boolean = false;
  value: any = '';
  passwordNotMatch: any = '';
  show: boolean;

  error_messages = {
    password: [
      { type: "required", message: 'Password is Required' },
      { type: "minlength", message: '*Minimum length should be 8' },
      { type: "maxlength", message: '*Maximum length should be 12' }
    ],
    confirmpassword: [
      { type: "required", message: 'Confirm Password is Required' },
      { type: "minlength", message: '*Minimum length should be 8' },
      { type: "maxlength", message: '*Maximum length should be 12' }
    ],
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,public user: User, public util: UtilProvider) {
    this.value = localStorage.getItem("setuserid")
    this.changePasswordForm = this.formBuilder.group(
      {
        password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(12)])),
        confirmpassword: new FormControl("", Validators.compose([Validators.required, this.equalto('password'), Validators.minLength(8), Validators.maxLength(12)]))
      },
      {
        validators: this.password.bind(this)
      }
    );

    this.show = false;
  }

  passwords() {
    console.log("passwords")
    this.show = !this.show;
  }

  // method for comparsion password and confirm password
  equalto(field_name): ValidatorFn {
    console.log("hello");
    return (control: AbstractControl): { [key: string]: any } => {

      let input = control.value;

      let isValid = control.root.value[field_name] == input
      if (!isValid)
        return { 'equalTo': { isValid } }
      else
        return null;
    };
  }

  //getting value of password and confirm password
  password(formGroup: FormGroup) {
    console.log("hello2");
    const { value: password } = formGroup.get("password");
    const { value: confirmpassword } = formGroup.get("confirmpassword");
    if (password === confirmpassword) {
      this.passwordNotMatch = ""
    } else {
      this.passwordNotMatch = "password not match"
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  onSubmit(){
   console.log(' this.changePasswordForm.value.password;', this.changePasswordForm.value.password)
    let formData = {
      "new_password": this.changePasswordForm.value.password,
      "user_id": this.value 
    }
    this.user.changePassword(formData).subscribe(res => {
      let response: any = res;
      if (response.status == "1") {
        this.util.presentToast(response.message);
        setTimeout(() => {
          this.navCtrl.setRoot('LoginPage');
        }, 500)
        return
      }
      else {
        this.util.presentToast(response.message);
        return
      }
    }, error => {
      console.error(error);
      this.util.presentToast(error.error.message);
    })
  }

}
