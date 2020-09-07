import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeTaxiPage } from './home-taxi';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HomeTaxiPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeTaxiPage),
    TranslateModule.forChild()

  ],
})
export class HomeTaxiPageModule {}
