import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeRoutePage } from './change-route';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChangeRoutePage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeRoutePage),
    TranslateModule.forChild()

  ],
})
export class ChangeRoutePageModule {}
