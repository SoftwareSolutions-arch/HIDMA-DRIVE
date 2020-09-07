import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAccountPage } from './create-account';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateAccountPage),
    TranslateModule.forChild()

  ],
})
export class CreateAccountPageModule {}
