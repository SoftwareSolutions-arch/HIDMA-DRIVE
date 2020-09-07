import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { UtilProvider } from "../../providers/util/util";
import { User } from '../../providers';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-change-vechicle',
  templateUrl: 'change-vechicle.html',
})
export class ChangeVechiclePage {
  addVehicle: FormGroup;
  error_messages: {};
  vehicleId: any = '';
  isLoading: boolean = false;
  authkey: any = '';
  userData: any = '';
  id: any = ''
  vehicleIds: any = ''

  constructor(public navCtrl: NavController, public storage: Storage, public util: UtilProvider,
    public navParams: NavParams, public formBuilder: FormBuilder, public user: User) {
    this.setupLoginFormData();

    this.storage.get('vehicle_details').then(userData => {
      console.log('userData2', userData)
      this.vehicleId = userData;
    })

    this.storage.get('userData').then(userData => {
      if (userData) {
        this.authkey = userData.Authorization;
      }
    });
  }

  setupLoginFormData() {
    this.error_messages = {
      vehicleType: [
        { type: "required", message: "Vehicle Type is required." },
      ],
      brand: [
        { type: "required", message: "Brand is required." },
      ],
      // model: [
      //   { type: "required", message: "Model is required." },
      // ],
      // manufacturer: [
      //   { type: "required", message: "Manufacturer is required." },
      // ],
      // color: [
      //   { type: "required", message: "Color is required." },
      // ],
      number_plate: [
        { type: "required", message: "Number Plate is required." },
      ],
      total_seats: [
        { type: "required", message: "Total Seats is required." },
      ],
      // price_KM: [
      //   { type: "required", message: "Price Per KM is required." },
      // ]
    };
    this.addVehicle = this.formBuilder.group(
      {
        vehicleType: new FormControl("",
          Validators.compose([
            Validators.required
          ])),
        brand: new FormControl("",
          Validators.compose([
            // Validators.required
          ])),
        model: new FormControl("",
          Validators.compose([
            // Validators.required
          ])),
        manufacturer: new FormControl("",
          Validators.compose([
            // Validators.required
          ])),
        number_plate: new FormControl("",
          Validators.compose([
            Validators.required
          ])),
        color: new FormControl("",
          Validators.compose([
            Validators.required
          ])),
        total_seats: new FormControl("",
          Validators.compose([
            Validators.required
          ])),
        // price_KM: new FormControl("",
        //   Validators.compose([
        //     Validators.required
        //   ]))
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeVechiclePage');
  }

  next() {
    console.log("vehicleId++", this.addVehicle.value.vehicleType);

    if (this.addVehicle.value.vehicleType == 1) {
      localStorage.setItem('vehicleType', '1')
    }

    else if (this.addVehicle.value.vehicleType == 2) {
      localStorage.setItem('vehicleType', '2')
    }

    else{
      localStorage.setItem('vehicleType', '3')
    }

    this.isLoading = true;
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.authkey,
      "Role": "3"
    })
    // let formData = new FormData();
    // formData.append('vehicle_type', this.addVehicle.value.vehicleType);
    // formData.append('brand', this.addVehicle.value.brand);
    // formData.append('model', this.addVehicle.value.model);
    // formData.append('manufacturer', this.addVehicle.value.manufacturer);
    // formData.append('number_plate', this.addVehicle.value.number_plate);
    // formData.append('color', this.addVehicle.value.color);
    // formData.append('no_of_seat', this.addVehicle.value.total_seats);
    // formData.append('price_per_km', this.addVehicle.value.price_KM);
    // formData.append('vehicle_id', this.vehicleId);



    let rawdata = {
      "vehicle_type": this.addVehicle.value.vehicleType,
      "brand": this.addVehicle.value.brand,
      "model": this.addVehicle.value.model,
      "manufacturer": this.addVehicle.value.manufacturer,
      "number_plate": this.addVehicle.value.number_plate,
      "color": this.addVehicle.value.color,
      "no_of_seat": this.addVehicle.value.total_seats,
      // "price_per_km": this.addVehicle.value.price_KM,
      "vehicle_id": this.vehicleId
    }
    this.user.changeVehicledata(rawdata, { headers: header }).subscribe(res => {
      console.log(res, 'res');
      let response: any = res;
      if (response) {
        this.util.presentToast(response.message);
        this.isLoading = false;
        // this.storage.set('vehicle_details', res);
        this.navCtrl.push('VehicleDocumentPage');
      }
    }, error => {
      console.error(error);
    })
  }
}
