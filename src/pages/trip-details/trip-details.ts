import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Api, User } from '../../providers';
import { Storage } from "@ionic/storage";

declare var google;

@IonicPage()
@Component({
  selector: 'page-trip-details',
  templateUrl: 'trip-details.html',
})

export class TripDetailsPage {
  authkey: any = '';

  lat1: any;
  long1: any;
  lat2: any;
  long2: any;
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  transactionDetails: any = '';
  from_destination: any = '';
  to_destination: any = '';
  date_of_journey: any = '';
  value: any = '';
  convertDate: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public api: Api, public user: User) {
    this.storage.get('userData').then(userData => {
      if (userData) {
        this.authkey = userData.Authorization;
        this.getHistoryDetails();
      }
    });
    this.value = navParams.get('Pagename');
  }

  ngAfterViewInit(): void {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      // zoom: 7,
      mapTypeId: 'roadmap',
      disableDefaultUI: true
    });
    let startMarker = new google.maps.Marker({
      position: {
        lat: this.lat2,
        lng: this.long2
      }, map: map, icon: 'assets/img/bluecircle.png'
    });


    startMarker = new google.maps.Marker({
      position: {
        lat: this.lat1,
        lng: this.long1
      }, map: map, icon: 'assets/img/greensquare.png'
    });

    this.directionsDisplay.setMap(map, startMarker);
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeColor: '#5d5e5d'
      },
      suppressMarkers: true,
    });
  }

  calculateAndDisplayRoute() {
    const that = this;
    this.directionsService.route({
      origin: this.from_destination,
      destination: this.to_destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      console.log("response", response)
      if (status === 'OK') {
        this.lat1 = response['routes'][0]['bounds']['Za']['i'];
        this.long1 = response['routes'][0]['bounds']['Va']['i'];
        this.lat2 = response['routes'][0]['bounds']['Za']['j'];
        this.long2 = response['routes'][0]['bounds']['Va']['j'];
        that.directionsDisplay.setDirections(response);
        this.ngAfterViewInit();
      }
    });
  }

  openNotifications() {
    this.navCtrl.push('NotificationPage');
  }

  getHistoryDetails() {
    console.log('this.authkey', this.authkey);
    let formData = {
      "trx_id": this.value
    }

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })
    this.api.getTransactionDetails(formData, { headers: header }).subscribe(res => {
      let response: any = res;
      console.log('response',response);
      this.from_destination = response.data.from_destination;
      this.to_destination = response.data.to_destination;
      this.date_of_journey = response.data.date_of_journey;
      if (response.status == "1") {
        this.calculateAndDisplayRoute();
        this.transactionDetails = response['data'];
        this.convertTime();
      }
      else {
        return
      }
    }, error => {
      console.error(error);
    })
  }


  convertTime(){
    console.log('this.date_of_journey',this.date_of_journey);

    var date = new Date(JSON.parse(this.date_of_journey));
    this.convertDate=date.toDateString()
     console .log('convertDate',this.convertDate);

  }
}
