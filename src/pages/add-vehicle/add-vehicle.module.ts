import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddVehiclePage } from './add-vehicle';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddVehiclePage,
  ],
  imports: [
    IonicPageModule.forChild(AddVehiclePage),
    TranslateModule.forChild()

  ],
})
export class AddVehiclePageModule {}
