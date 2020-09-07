import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgZone } from '@angular/core';
import { User } from '../../providers/user/user';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UtilProvider } from "../../providers/util/util";
import { Storage } from "@ionic/storage";

declare var google;

@IonicPage()
@Component({
  selector: 'page-change-route',
  templateUrl: 'change-route.html',
})
export class ChangeRoutePage {
  name: any
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  lat1: any = '';
  long1: any = '';
  lat2: any = '';
  long2: any = '';

  depatureTime: any = '';
  arrivalTime: any = '';
  days: any = '';
  // assistant_name: any = '';
  // agency_name: any = '';
  popularCities: any = [];
  // headerLocation: any = '';
  // headerLocations: any = '';
  // price_Seat: any = '';
  autocompleteItemsSearch: any = [];
  autocompleteItemsSearchs: any = [];

  depatureRoundTime: any
  arrivalRoundTime: any
  days_Round: any = '';
  assistant_Round_name: any='';
  round_trip_value: any

  isAcSelect: any = false;
  isWaterBottleSelect: any = false;
  isBlanketSelect: any = false;
  isMovieSelect: any = false;
  isWiFiSelect: any = false;
  isChargingPoint: any = false;
  service = new google.maps.places.AutocompleteService();
  roundTripForm: boolean = false;
  authkey: any = '';


  arrivalMili: any
  departuareMili: any
  departureRound: any
  arrivalRound: any
  routeDetails: any = '';
  showSeasonDiscount: boolean = false;
  isSeasonDiscountshow: boolean = true;
  userId: any = '';
  userData: any = {
    headerLocation: [],
    headerLocations: [],
    depatureTime: '',
    arrivalTime: '',
    facilities: '',
    assistant_name: '',
    agency_name: '',
    price_Seat: '',
    discount: ''
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder,
    public zone: NgZone, public user: User, public util: UtilProvider, public storage: Storage) {
    this.storage.get('userData').then(authKeys => {
      if (authKeys) {
        this.authkey = authKeys.Authorization
      }
    });
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.storage.get('routeDetails').then(routeDetails => {
      console.log('routeDetails', routeDetails);
      let data: any = routeDetails[0];
      this.userId = data.id;
      if (data) {
        console.log('data', data.fare)
        this.userData = {
          headerLocation: data.from_destination,
          headerLocations: data.to_destination,
          depatureTime: data.time_depart,
          arrivalTime: data.time_arrive,
          bus_travels: data.bus_travels,
          assistant_name: data.assistant_name,
          agency_name: data.bus_travels,
          facilities: data.facilities,
          price_Seat: data.fare
        };
      }
    })
  }

  onChangeLocation(event) {
    if (event == '') {
      this.autocompleteItemsSearch = [];
      return;
    }
    const me = this;
    this.service.getPlacePredictions({ input: event }, function (predictions, status) {
      me.autocompleteItemsSearch = [];
      me.zone.run(function () {
        if (predictions) {
          predictions.forEach(function (prediction) {
            me.autocompleteItemsSearch.push(prediction);
          });
        }
      });
    });
  }

  onChangeLocations(event) {
    if (event == '') {
      this.autocompleteItemsSearchs = [];
      return;
    }
    const me = this;
    this.service.getPlacePredictions({ input: event }, function (predictions, status) {
      me.autocompleteItemsSearchs = [];
      me.zone.run(function () {
        if (predictions) {
          predictions.forEach(function (prediction) {
            me.autocompleteItemsSearchs.push(prediction);
          });
        }
      });
    });
  }

  chooseItemSource(sourceData: any) {
    this.userData.headerLocation = sourceData.description;
    this.autocompleteItemsSearch = [];

  }

  chooseItemSources(sourceData: any) {
    this.userData.headerLocations = sourceData.description;
    this.autocompleteItemsSearchs = [];
  }

  rememberMe(event) {
    this.popularCities = {
      "isAcSelect": this.isAcSelect,
      "isWaterBottleSelect": this.isWaterBottleSelect,
      "isBlanketSelect": this.isBlanketSelect,
      "isMovieSelect": this.isMovieSelect,
      "isWiFiSelect": this.isWiFiSelect,
      "isChargingPoint": this.isChargingPoint,
    }

    console.log(this.popularCities, " this.popularCities");
  }

  calculateAndDisplayRoute() {
    const that = this;
    this.directionsService.route({
      origin: this.userData.headerLocation,
      destination: this.userData.headerLocations,
      travelMode: 'DRIVING'
    }, (response, status) => {
      console.log("response", response)
      if (status === 'OK') {
        this.lat1 = response['routes'][0]['bounds']['Za']['i'];
        this.long1 = response['routes'][0]['bounds']['Va']['i'];
        this.lat2 = response['routes'][0]['bounds']['Za']['j'];
        this.long2 = response['routes'][0]['bounds']['Va']['j'];
        this.saveDetails();
      }
    });
  }

  saveDetails() {

    var t = this.userData.depatureTime;
    let ms = Number(t.split(':')[0])
    let hs = Number(t.split(':')[1])

    // arrival  time for single route
    var u = this.userData.arrivalTime;
    let v = Number(u.split(':')[0]);
    let vy = Number(u.split(':')[1]);

    if (this.roundTripForm == true) {
      var arrival = this.arrivalRoundTime;
      let ar = Number(arrival.split(':')[0]);
      let arm = Number(arrival.split(':')[1]);

      // round trip arrival time
      var departure = this.depatureRoundTime;
      let dr = Number(departure.split(':')[0]);
      let dmr = Number(departure.split(':')[1]);

      this.arrivalRound = miliseconds(ar, arm, 0);
      this.departureRound = miliseconds(dr, dmr, 0);
    }

    function miliseconds(hrs, min, sec) {
      return ((hrs * 60 * 60 + min * 60 + sec) * 1000);
    }

    this.departuareMili = miliseconds(ms, hs, 0);
    this.arrivalMili = miliseconds(v, vy, 0);


    if (this.userData.agency_name == '' || this.userData.agency_name == '') {
      this.util.presentToast("please fill all the details");
      return
    }

    this.util.presentLoading();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })

    let formData = {
      "from_destination": this.userData.headerLocation,
      "from_destination_lat": this.lat1,
      "from_destination_long": this.long1,
      "to_destination": this.userData.headerLocations,
      "to_destination_lat": this.lat2,
      "to_destination_long": this.long2,
      "departure_time": this.departuareMili,
      "arrival_time": this.arrivalMili,
      "days": this.days,
      "assistant_name": this.userData.assistant_name,
      "travel_name": this.userData.agency_name,
      "price_per_seat": this.userData.price_Seat,
      "popular_facility": this.userData.popularCities,
      "is_roundtrip": this.round_trip_value,
      "time_depart_round": this.departureRound,
      "time_arrive_round": this.arrivalRound,
      "days_round": this.days_Round,
      "discount": this.userData.discount,
    }

    console.log(JSON.stringify(formData));
    this.user.editRoute(formData, { headers: headers }).subscribe(res => {
      this.util.dismissLoading();
      let response: any = res;
      if (response.status == "1") {
        this.storage.set('routeDetails', response.data);
        this.util.presentToast(response.message);
        setTimeout(() => {
          this.navCtrl.setRoot('HomePage');
        }, 500)
        return
      }
      else {
        this.util.presentToast(response.message);
        this.util.dismissLoading();
        return
      }
    }, error => {
      this.util.dismissLoading();
      console.error(error);
      this.util.presentToast(error.message);
    })
  }

  selectJourneyData(event) {
    if (event.checked == true) {
      this.roundTripForm = true;
      this.round_trip_value = 1
    }
    else {
      this.roundTripForm = false;
      this.round_trip_value = 0
    }
  }

  btn_reportlog() {
    this.isSeasonDiscountshow = false;
    this.showSeasonDiscount = true;
  }

  btn_deletlog() {
    this.isSeasonDiscountshow = false;
    this.showSeasonDiscount = false;
  }
}
