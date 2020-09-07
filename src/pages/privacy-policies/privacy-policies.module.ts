import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPoliciesPage } from './privacy-policies';

@NgModule({
  declarations: [
    PrivacyPoliciesPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyPoliciesPage),
  ],
})
export class PrivacyPoliciesPageModule {}
