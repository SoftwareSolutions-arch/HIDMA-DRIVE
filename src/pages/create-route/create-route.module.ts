import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateRoutePage } from './create-route';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateRoutePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateRoutePage),
    TranslateModule.forChild()

  ],
})
export class CreateRoutePageModule {}
