import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {CARDSELECTION_MODULE_DECLARATIONS, CardSelectionRoutingModule} from  './CardSelection-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    CardSelectionRoutingModule
  ],
  declarations: CARDSELECTION_MODULE_DECLARATIONS,
  exports: CARDSELECTION_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardSelectionModule { }