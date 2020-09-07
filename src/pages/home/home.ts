import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, AlertController } from 'ionic-angular';
import { ElementRef, ViewChild } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from "@ionic/storage";
import { Api, User } from "../../providers";
import { UtilProvider } from "../../providers/util/util";

declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  showmap: boolean = false;
  showContent: boolean = false;
  id: any = '';
  getListhomeData: any = [];
  lat1: any = '';
  long1: any = '';
  lat2: any = '';
  long2: any = '';

  toSource: any = {};
  toDestination: any = {};
  authkey: any = '';
  pos: any = '';
  routeID: any = '';
  routeDetails: any = '';
  busStart: any = '';
  map: any = '';

  markers = [];
  watch: any = ''
  HiddenWhenTap: boolean;

  timeInSeconds: any = '';
  time: any = '';
  runTimer: boolean = true;
  hasStarted: boolean = true;
  hasFinished: boolean = true;
  remainingTime: any = '';
  displayTime: any = '';
  isCarSelect: any = '';
  from_destination_lat: any = '';
  from_destination_long: any = '';
  private subscription: any;

  constructor(public navCtrl: NavController, public storage: Storage, private alertCtrl: AlertController,
    public navParams: NavParams, public api: Api, public geolocation: Geolocation,
    public user: User, public util: UtilProvider) {
    this.storage.get('userData').then(userData => {
      this.routeID = userData.route_id;
      this.authkey = userData.Authorization
      this.getdetailsHomedata();
    })
    storage.get('routeDetails').then(routeDetails => {
      this.routeDetails = routeDetails;
      this.getRoutedetails();
    })
    this.isCarSelect = localStorage.getItem('carmotorSelect');

    // setTimeout(() => {
    //   this.startWatch();
    // }, 5000);
  }


  ionViewDidLoad(): void {
    if (localStorage.getItem('isTripStart') == '1') {
      this.HiddenWhenTap = false;
    }
    else {
      this.HiddenWhenTap = true;
    }

    this.createMap();
    this.initMap();
  }

  createMap() {
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 16
    });
  }

  initMap(): void {
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.toSource.lat = resp.coords.latitude;
    //   this.toSource.lng = resp.coords.longitude;
    //   const pos = {
    //     lat: this.toSource.lat,
    //     lng: this.toSource.lng
    //   };
    // this.map.setCenter(pos);
    // this.addMarker( new google.maps.LatLng(this.latitude,this.longitude),'assets/img/source.png')
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeColor: '#178D42'
      },
    });
    this.directionsDisplay.setDirections({ routes: [] });
    // });
  }

  calculateAndDisplayRoute() {
    const that = this;
    this.directionsService.route({
      origin: this.toSource,
      destination: this.toDestination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.lat1 = response['routes'][0]['bounds']['Za']['i'];
        this.long1 = response['routes'][0]['bounds']['Va']['i'];
        this.lat2 = response['routes'][0]['bounds']['Za']['j'];
        this.long2 = response['routes'][0]['bounds']['Va']['j'];
        that.directionsDisplay.setDirections(response);
      }
    });
  }

  getdetailsHomedata() {
    this.util.presentLoading();
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })
    this.api.getHomedata({ headers: header }).subscribe(res => {
      this.util.dismissLoading();
      let response: any = res;
      console.log('response', response);
      if (response.message == "Records Found") {
        this.id = response['data'][0]['id'];
        this.showmap = false;
        this.showContent = true;
        this.getListhomeData = res['data'];
        this.toSource.lat = parseFloat(res['data'][0]['from_destination_lat'])
        this.toSource.lng = parseFloat(res['data'][0]['from_destination_long'])
        this.toDestination.lat = parseFloat(res['data'][0]['to_destination_lat'])
        this.toDestination.lng = parseFloat(res['data'][0]['to_destination_long'])
        this.busStart = res['data'][0]['bus_start'];
        this.calculateAndDisplayRoute();
        this.convertTime();
      }
      else {
        this.showmap = true;
        this.showContent = false;
      }
    }, error => {
      console.error(error);
    })
  }

  startWatch() {
    this.watch = this.geolocation.watchPosition();
    this.subscription = this.watch.subscribe((data) => {
      console.log('data from watchPosition', data);
      this.toSource.lat = data.coords.latitude;
      this.toSource.lng = data.coords.longitude;
      const that = this;
      this.directionsService.route({
        origin: this.toSource,
        destination: this.toDestination,
        travelMode: 'DRIVING',
      }, (response, status) => {
        if (status === 'OK') {
          that.directionsDisplay.setDirections(response);
        }
      });
    });
  }

  updatelocation() {
    setInterval(() => {
      this.startWatch();
    }, 5000);
  }

  tapToStartBooking() {
    let alert = this.alertCtrl.create({
      title: 'Are You Sure',
      message: 'Do You want to start the trip.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return
          }
        },
        {
          text: 'Ok',
          handler: () => {
            // this.updatelocation();
            this.startRide();
          }
        }
      ]
    });
    alert.present();
  } 

  startRide() {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })
    let formData = {
      "route_id": this.id,
      "lat": this.toSource.lat,
      "lang": this.toSource.lng,
      "type": "0"
    }

    this.api.getTapToStart({ headers: header }, formData).subscribe(res => {
      let response: any = res;
      if (response.status == '1') {
        this.updatelocation();
        this.util.presentToast(response['message']);
        localStorage.setItem('isTripStart', '1');
        this.HiddenWhenTap = false;
      }
      else if (response.status == '0') {
        this.util.presentToast(response['message']);
        return
      }
    }, error => {
      this.util.presentToast(error['message']);
    })
  }

  tapToEndBooking() {
    let alert = this.alertCtrl.create({
      title: 'Are You Sure',
      message: 'Do You want to end the trip.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.endRide();
          }
        }
      ]
    });
    alert.present();
  }

  endRide() {
    if (this.toSource.lat == this.lat2 && this.toSource.lng == this.long2) {
      // this.deleteMarkers();
      localStorage.removeItem('isTripStart');
      // this.ngOnInit();
      let header = new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": this.authkey,
        "Role": "3"
      })
      let formData = {
        "route_id": this.id,
        "lat": this.toSource.lat,
        "lang": this.toSource.lng,
        "type": "1"
      }

      this.api.getTapToStart({ headers: header }, formData).subscribe(res => {
        let response: any = res;
        console.log('response', response)
        if (response.status == 1) {
          this.util.presentToast(response.message);

        }
      }, error => {
        this.util.presentToast(error.message);
        console.error(error);
      })
    }

    else {
      this.util.presentToast(`you haven't reached your destination`);
      let alert = this.alertCtrl.create({
        title: 'Are You Sure',
        message: 'Still Do You want to cancel the trip.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              return
            }
          },
          {
            text: 'Ok',
            handler: () => {
              localStorage.removeItem('isTripStart');
              let header = new HttpHeaders({
                'Content-Type': 'application/json',
                "Authorization": this.authkey,
                "Role": "3"
              })
              let formData = {
                "route_id": this.id,
                "lat": this.toSource.lat,
                "lang": this.toSource.lng,
                "type": "1"
              }

              this.api.getTapToStart({ headers: header }, formData).subscribe(res => {
                let response: any = res;
                console.log('response', response)
                if (response.status == 1) {
                  this.util.presentToast(response.message);
                  this.tripEnd();
                }
              }, error => {
                this.util.presentToast(error.message);
                console.error(error);
              })
            }
          }
        ]
      });
      alert.present();
    }
  }

  tripEnd() {
    // this.subscription.unsubscribe;
    this.watch = null;
    this.map.set(null);
    this.HiddenWhenTap = true;
    // this.directionsDisplay.setMap(null);
    // this.directionsDisplay.setDirections({ routes: [] });
    setTimeout(() => {
      // this.deleteMarkers();
      this.getdetailsHomedata();
    }, 1000)
  }

  // open notification 
  openNotifications() {
    this.navCtrl.push('NotificationPage');
  }

  // refresh page
  refresh() {
    this.util.presentLoading();
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })
    this.api.getHomedata({ headers: header }).subscribe(res => {
      let response: any = res;
      if (response.message == "Records Found") {
        this.id = response['data'][0]['id'];
        this.showmap = false;
        this.showContent = true;
        this.getListhomeData = res['data'];
        this.toSource.lat = parseFloat(res['data'][0]['from_destination_lat']);
        this.toSource.lng = parseFloat(res['data'][0]['from_destination_long']);
        this.toDestination.lat = parseFloat(res['data'][0]['to_destination_lat']);
        this.toDestination.lng = parseFloat(res['data'][0]['to_destination_long']);
        this.busStart = res['data'][0]['bus_start'];
        this.calculateAndDisplayRoute();
        this.util.dismissLoading();
      }
      else {
        this.showmap = true;
        this.showContent = false;
      }
    }, error => {
      console.error(error);
    })
  };

  // add route
  addRoute() {
    this.navCtrl.push('CreateRoutePage');
  }

  // time and stamp use
  initTimer() {
    if (!this.timeInSeconds) {
      this.timeInSeconds = this.busStart;
    }

    this.time = this.timeInSeconds;
    this.runTimer = false;
    this.hasStarted = false;
    this.hasFinished = false;
    this.remainingTime = this.timeInSeconds;

    this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
  }

  startTimer() {
    this.runTimer = true;
    this.hasStarted = true;
    this.timerTick();
  }

  pauseTimer() {
    this.runTimer = false;
  }

  resumeTimer() {
    this.startTimer();
  }

  timerTick() {
    setTimeout(() => {

      if (!this.runTimer) { return; }
      this.remainingTime--;
      this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
      if (this.remainingTime > 0) {
        this.timerTick();
      }
      else {
        this.hasFinished = true;
      }
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  convertTime() {
    console.log(this.busStart, 'this.busStart');
    let difference = this.busStart - Date.now()
    this.busStart = difference;
    console.log(this.busStart, 'this.busStart');
    this.initTimer();
    this.startTimer();
  }



  //

  getRoutedetails() {
    // if (this.routeDetails == '' || this.routeDetails == null) {

    // this.util.presentLoading();
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })

    let formata = {
      "route_id": this.routeID
    }

    this.user.getRouteDetails({ headers: header }, formata).subscribe(res => {
      let response: any = res;
      if (response.status == "1") {
        this.storage.set('routeDetails', response.data);
        // this.util.dismissLoading();
      }
      else {
        return
      }
    }, error => {
      console.error(error);
    })
    // }
  }

}