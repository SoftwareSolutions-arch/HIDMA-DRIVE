import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarkerPage } from './marker';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MarkerPage,
  ],
  imports: [
    IonicPageModule.forChild(MarkerPage),
    TranslateModule.forChild()

  ],
})
export class MarkerPageModule {}
