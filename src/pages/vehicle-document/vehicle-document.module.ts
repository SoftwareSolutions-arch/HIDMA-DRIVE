import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VehicleDocumentPage } from './vehicle-document';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    VehicleDocumentPage,
  ],
  imports: [
    IonicPageModule.forChild(VehicleDocumentPage),
    TranslateModule.forChild()

  ],
})
export class VehicleDocumentPageModule {}
