import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import { ElementRef, ViewChild } from '@angular/core';
import { Api } from '../../providers/api/api';
import { HttpHeaders } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { UtilProvider } from '../../providers/util/util';
import {Observable} from "rxjs";
import {Events} from "ionic-angular/index";

declare var google;

@IonicPage()
@Component({
  selector: 'page-home-taxi',
  templateUrl: 'home-taxi.html',
})

export class HomeTaxiPage {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  authkey: any = '';
  latitude: any = '';
  longitude: any = '';
  fromDestination: any = '';
  toDestination: any = '';
  map: any = '';
  value: any = '';
  requestId: any = '';
  currentLocation: any = {};
  to_destination: any = {};
  markers = [];
  isTripStart: boolean = true;
  isTripEnd: boolean = false;
  watch: any;
  subscription: any;
  enableTapToStart: boolean = true;

  constructor(private geolocation: Geolocation,public util: UtilProvider,
              public storage: Storage, public navCtrl: NavController,
              public navParams: NavParams,public events: Events,
              public api: Api){
    this.storage.get('userData').then(userData => {
      this.authkey = userData.Authorization;
    })
    events.subscribe('rideAccepted', (value) => {
      this.rideAccepted();
    });
    events.subscribe('reachAtLocation', (value) => {
      this.enableTapToStart = false;
    });
    this.rideAccepted();
    this.updatelocation();
  }

  ionViewDidLoad(): void {
    this.createMap();
    this.initMap();
    /*if (this.value !== '' || this.value !== null) {
      let data = localStorage.getItem('tripinprogress')
      if (data == '1') {
        this.startTrip()
      }
    }*/
  }

  openNotifications() {
    this.navCtrl.push('NotificationPage');
  }

  updateCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLocation.lat = resp.coords.latitude;
      this.currentLocation.lng = resp.coords.longitude;
      let rawData = {
        "lat": this.currentLocation.lat,
        "lang": this.currentLocation.lng,
        "request_id": this.requestId,
      }
      let header = new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": this.authkey,
        "Role": "3"
      })
      this.api.updateLatLong({ headers: header }, rawData).subscribe(res => {
      }, error => {
        console.log(error)
      })
    })

  }

  updatelocation() {
    setInterval(() => {
      this.updateCurrentLocation();
    }, 8000);
  }

  calculateAndDisplayRoute() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLocation.lat = resp.coords.latitude;
      this.currentLocation.lng = resp.coords.longitude;

      const that = this;
      this.directionsDisplay.setMap(this.map);
      this.directionsService.route({
        origin: this.currentLocation,
        destination: this.to_destination,
        travelMode: 'DRIVING',
      }, (response, status) => {
        if (status === 'OK') {
          that.directionsDisplay.setDirections(response);
          this.startWatch();
        }
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  createMap(){
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 16
    });
  }

  initMap(): void {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };
      this.map.setCenter(pos);
      this.addMarker( new google.maps.LatLng(this.latitude,this.longitude),'assets/img/source.png')
      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setOptions({
        polylineOptions: {
          strokeColor: '#178D42'
        },
      });
      this.directionsDisplay.setDirections({routes: []});
    });
  }

  setHomeMarker(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };
      this.map.setCenter(pos);
      this.addMarker( new google.maps.LatLng(this.latitude,this.longitude),'assets/img/source.png')
    });
  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  resetMapBounds() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.markers.length; i++) {
      bounds.extend(this.markers[i].position);
    }
    this.map.fitBounds(bounds);
    if (this.map.getZoom() > 18) {
      this.map.setZoom(18);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  startTrip() {
    this.isTripStart = false;
    this.isTripEnd = true;
    this.util.presentLoading();
    let vehicleType = localStorage.getItem('vehicleType');
    let rawData = {
      "booking_request_id": this.value.booking_request_id,
      "lat": this.currentLocation.lat,
      "lang": this.currentLocation.lng,
      "type": "0",
      "vehicle_type": vehicleType,
    }
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })

    this.api.tapToStartBooking({ headers: header }, rawData).subscribe(res => {
      this.util.dismissLoading();
      let response: any = res;
      if (response.status == 1) {
        this.to_destination.lat = parseFloat(this.value.to_destination_lat)
        this.to_destination.lng = parseFloat(this.value.to_destination_lang)
        this.calculateAndDisplayRoute();
      }
    }, error => {
      console.log(error)
    })
  }

  endTrip() {
    this.util.presentLoading();
    var vehicleType = localStorage.getItem('vehicleType');
    let rawData = {
      "booking_request_id": this.value.booking_request_id,
      "lat": this.currentLocation.lat,
      "lang": this.currentLocation.lng,
      "type": "1",
      "vehicle_type": vehicleType,
    }

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })

    this.api.tapToStartBooking({ headers: header }, rawData).subscribe(res => {
      let response: any = res;
      if (response.status == 1) {
        this.isTripStart = true;
        this.isTripEnd = false;
        this.stopWatch();
      }else {
        this.util.dismissLoading();
      }
    }, error => {
      console.log(error)
    })
  }

  startWatch() {
    this.deleteMarkers();
    this.watch = this.geolocation.watchPosition();
    this.subscription = this.watch.subscribe((data) => {
      this.currentLocation.lat = data.coords.latitude;
      this.currentLocation.lng = data.coords.longitude;
      const that = this;
      this.directionsService.route({
        origin: this.currentLocation,
        destination: this.to_destination,
        travelMode: 'DRIVING',
      }, (response, status) => {
        if (status === 'OK') {
          that.directionsDisplay.setDirections(response);
        }
      });
    });
  }

  stopWatch() {
    this.subscription.unsubscribe();
    this.watch = null;
    this.enableTapToStart = true;
    this.storage.set('acceptBooking','');
    this.requestId = ''; //make blank the request id when trip completed
    this.map.set(null);
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setDirections({routes: []});
    setTimeout(()=>{
      // this.createMap();
      this.deleteMarkers();
      this.setHomeMarker();
      this.util.dismissLoading();
    },1000)
  }

  rideAccepted() {
    this.storage.get('acceptBooking').then(data=>{
      if (data) {
        this.value=data;
        this.requestId=data.booking_request_id;
        this.to_destination.lat = parseFloat(this.value.from_destination_lat)
        this.to_destination.lng = parseFloat(this.value.from_destination_lang)
        this.calculateAndDisplayRoute();
      }
    })
  }
}
