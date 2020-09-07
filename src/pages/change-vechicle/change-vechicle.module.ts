import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeVechiclePage } from './change-vechicle';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ChangeVechiclePage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeVechiclePage),
    TranslateModule.forChild()

  ],
})
export class ChangeVechiclePageModule {}
