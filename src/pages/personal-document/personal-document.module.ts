import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalDocumentPage } from './personal-document';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PersonalDocumentPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalDocumentPage),
    TranslateModule.forChild()
  ],
})
export class PersonalDocumentPageModule {}
