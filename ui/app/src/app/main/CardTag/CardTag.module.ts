import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {CARDTAG_MODULE_DECLARATIONS, CardTagRoutingModule} from  './CardTag-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    CardTagRoutingModule
  ],
  declarations: CARDTAG_MODULE_DECLARATIONS,
  exports: CARDTAG_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardTagModule { }