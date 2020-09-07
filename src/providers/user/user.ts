import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Camera, CameraOptions } from "@ionic-native/camera";

@Injectable()
export class User {
  _user: any;
  base64Image: any;
  picture: any;
  theme: any;
  user_login: string = 'login';
  upload_image: string = 'Authentication/upload_image/';
  registerUser: string = 'register';
  // uploadDriverProfile: string = 'profile_update';
  update_vehicle_document: string = 'update_vehicle_document';
  add_vehicle_document: string = 'add_vehicle';
  forgot_password: string = 'forgot_password';
  forget_password_verify: string = 'forgot_password_verify_otp';
  send_otp: string = 'forgot_password_verify_otp';
  change_password: string = 'change_forgot_password';
  validate_mobile_number: string = 'validate'
  add_route: string = 'add_route';
  resend_otp:string='resend_otp';
  home_data: string = 'get_dashboard_data';
  user_logout='logout';
  get_notifications: string = 'get_notification_list';
  tap_to_start_booking:string='tap_to_start_booking';
  edit_route: string = 'edit_route';
  profile_updates: string = 'profile_update';
  change_vehicle: string = 'change_vehicle';
  get_routes: string = 'get_routes';
  company_resistration_list: string = 'company_resistration_list'

  constructor(public api: Api, private camera: Camera) { }

  // login(accountInfo: any) {
  //   let seq = this.api.post('login', accountInfo).share();

  //   seq.subscribe((res: any) => {
  //     // If the API returned a successful response, mark the user as logged in
  //     if (res.status == 'success') {
  //       this._loggedIn(res);
  //     } else {
  //     }
  //   }, err => {
  //     console.error('ERROR', err);
  //   });

  //   return seq;
  // }


  login(accountInfo: any) {
    let res = this.api.post(this.user_login, accountInfo).share();
    return res;
  }

  onlogout(header:any){
      let res = this.api.get(this.user_logout,header).share();
      return res;
  }


  getHomedata(header:any){
      let res = this.api.get(this.home_data,header).share();
      return res;
  }

  verifyOtp(data: any) {
    let res = this.api.post(this.forget_password_verify, data).share();
    return res;
  }

  resendOtp(data: any) {
    let res = this.api.post(this.resend_otp, data).share();
    return res;
  }

  changePassword(data: any) {
    let res = this.api.post(this.change_password, data).share();
    return res;
  }

  validate(data: any) {
    let res = this.api.post(this.validate_mobile_number, data).share();
    return res;
  }
  getCompanyRegistration() {
    let res = this.api.get(this.company_resistration_list).share();
    return res;
  }
  sendOtp(data: any) {
    let res = this.api.post(this.send_otp, data).share();
    return res;
  }

  createRoute(data: any,header:any) {
    let res = this.api.post(this.add_route, data,header).share();
    return res;
  }

  editRoute(data: any,header:any) {
    let res = this.api.post(this.edit_route, data,header).share();
    return res;
  }

  getRouteDetails(header:any,data:any) {
    let res = this.api.post(this.get_routes, data,header).share();
    return res;
  }

  // logout() {
  //   this._user = null;
  // }

  _loggedIn(resp) {
    this._user = resp.user;
  }

  uploadImage(data: any) {
    let res = this.api.post(this.upload_image, data).share();
    return res;
  }

  // changeProfileImage(data: any,header:any) {
  //   let res = this.api.post(this.profile_updates, data,header).share();
  //   return res;
  // }

  changeProfileImages(data: any,header:any) {
    let res = this.api.post(this.profile_updates, data,header).share();
    return res;
  }

  uploadUserdata(data: any) {
    let res = this.api.post(this.registerUser, data).share();
    return res;
  }

  uploadVehicledata(data: any) {
    let res = this.api.post(this.update_vehicle_document, data).share();
    return res;
  }

  addVehicledata(data: any) {
    let res = this.api.post(this.add_vehicle_document, data).share();
    return res;
  }

  changeVehicledata(data: any,header: any){
    let res = this.api.post(this.change_vehicle, data,header).share();
    return res;
  }

  forgetPassword(data: any) {
    let res = this.api.post(this.forgot_password, data).share();
    return res;
  }


  getNotification(data: any,header: any) {
    let res = this.api.post(this.get_notifications,data, header).share();
    return res;
  }

  getTapToStart(data: any,header:any) {
    let res = this.api.post(this.tap_to_start_booking, data,header).share();
    return res;
  }

}
