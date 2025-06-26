import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {FELLOWSHIP_MODULE_DECLARATIONS, FellowshipRoutingModule} from  './Fellowship-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    FellowshipRoutingModule
  ],
  declarations: FELLOWSHIP_MODULE_DECLARATIONS,
  exports: FELLOWSHIP_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FellowshipModule { }