import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ElementRef, ViewChild } from '@angular/core';

declare var google;

@IonicPage()
@Component({
  selector: 'page-marker',
  templateUrl: 'marker.html',
})
export class MarkerPage {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  latitude: any = '';
  longitude: any = '';
  constructor(private geolocation: Geolocation,public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void { 
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 16
      });
      /*location object*/
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };
      map.setCenter(pos);
      const icon = {
        url: 'assets/img/source.png', // image url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      };
      const marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Hello World!',
        icon: icon
      });

      marker.setMap(map);
    })
  }

  openNotifications() {
    this.navCtrl.push('NotificationPage');
  }

}
