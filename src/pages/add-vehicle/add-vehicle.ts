import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { UtilProvider } from "../../providers/util/util";
import { User } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-add-vehicle',
  templateUrl: 'add-vehicle.html',
})
export class AddVehiclePage {
  addVehicle: FormGroup;
  error_messages: {};
  userid: any = '';
  vehicleTypeN: any = '';
  isLoading: boolean = false;
  ismotorSelect: boolean = true;
  total_seats: any = '';
  vehicleType = [
    {

      "vehicleName": "Bus"
    },
    {
      "vehicleName": "Car"
    },
    {

      "vehicleName": "Motorcycle"
    }
  ]
  constructor(public navCtrl: NavController, public storage: Storage, public util: UtilProvider,
    public navParams: NavParams, public formBuilder: FormBuilder, public user: User) {
    this.setupLoginFormData();

    this.storage.get('personalData').then(userData => {
      this.userid = userData.id;
    })
  }

  ionViewDidLoad() {
  }

  getvehicledetails(vehicleList) {
    if (vehicleList.vehicleName == 'Motorcycle') {
      this.ismotorSelect = false;
      this.vehicleTypeN = 3;
    }

    else if (vehicleList.vehicleName == 'Car') {
      this.ismotorSelect = false;
      this.vehicleTypeN = 2;
    }

    else if (vehicleList.vehicleName == 'Bus') {
      this.ismotorSelect = true;
      this.vehicleTypeN = 1;
    }
  }

  setupLoginFormData() {
    this.error_messages = {
      vehicleType: [
        { type: "required", message: "Vehicle Type is required." },
      ],
      brand: [
        { type: "required", message: "Brand is required." },
      ],
      number_plate: [
        { type: "required", message: "Number Plate is required." },
      ]
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
            // Validators.required
          ])),
        total_seats: new FormControl("",
          Validators.compose([
            // Validators.required
          ])),
      })

    this.addVehicle.controls.total_seats.setValue(0);
  }

  next() {
    console.log('this.addVehicle.value.vehicleType', this.vehicleTypeN)
    this.isLoading = true;
    let formData = new FormData();
    formData.append('vehicle_type', this.vehicleTypeN);
    formData.append('brand', this.addVehicle.value.brand);
    formData.append('model', this.addVehicle.value.model);
    formData.append('manufacturer', this.addVehicle.value.manufacturer);
    formData.append('number_plate', this.addVehicle.value.number_plate);
    formData.append('color', this.addVehicle.value.color);
    formData.append('no_of_seat', this.addVehicle.value.total_seats);
    formData.append('price_per_km', this.addVehicle.value.price_Seat);
    formData.append('user_id', this.userid);
    this.user.addVehicledata(formData).subscribe(res => {
      let response: any = res;
      console.log(response, 'response')
      if (response) {
        this.util.presentToast(response.message);
        this.isLoading = false;
        this.storage.set('vehicle_details', response.data.id);
        this.navCtrl.push('VehicleDocumentPage');
      }
    }, error => {
      console.error(error);
    })
  }

  backPage() {
    this.navCtrl.setRoot('LoginPage');
  }
}
