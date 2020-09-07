import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'http://15.206.103.57/TaxiBooking/taxiapi/Api/Driver';

  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }

  getHomedata(header: any) {
    return this.http.get(this.url + '/get_dashboard_data', header);
  }

  getTapToStart(header: any,data:any){
    return this.http.post(this.url+'/tap_to_start_booking',data,header);
  }

  acceptBooking(header: any,data:any){
    return this.http.post(this.url+'/accept_booking_request',data,header);
  }

  updateLatLong(header: any,data:any){
    return this.http.post(this.url+'/update_user_current_lat_lang',data,header);
  }

  tapToStartBooking(header: any,data:any){
    return this.http.post(this.url+'/tap_to_start_taxi_booking',data,header);
  }

  changeProfileImage(data:any,header:any){
    return this.http.post(this.url+'/profile_update',data,header);
  }

  getNotification(header: any, data: any) {
    return this.http.post(this.url + '/get_notification_list', data,header);
  }

  getRouteDetails(data: any,header: any) {
    return this.http.post(this.url + '/get_routes', data,header);
  }

  onlogout(header: any) {
    return this.http.get(this.url + '/logout', header);
  }

  getHistoryDetails(data: any,header: any) {
    return this.http.post(this.url + '/get_transaction_history', data,header);
  }

  
  getTransactionDetails(data: any,header: any) {
    return this.http.post(this.url + '/get_transaction_details', data,header);
  }

  getAboutDetails() {
    return this.http.get('http://15.206.103.57/TaxiBooking/taxiapi/Api/Content/getAboutUs');
  }

  getPrivacyDetails() {
    return this.http.get('http://15.206.103.57/TaxiBooking/taxiapi/Api/Content/getPrivacyPolicy');
  }

  getTermsandConditions() {
    return this.http.get('http://15.206.103.57/TaxiBooking/taxiapi/Api/Content/getTermsCondition');
  }

}
