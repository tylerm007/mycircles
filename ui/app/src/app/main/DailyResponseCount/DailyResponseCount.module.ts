import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {DAILYRESPONSECOUNT_MODULE_DECLARATIONS, DailyResponseCountRoutingModule} from  './DailyResponseCount-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    DailyResponseCountRoutingModule
  ],
  declarations: DAILYRESPONSECOUNT_MODULE_DECLARATIONS,
  exports: DAILYRESPONSECOUNT_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DailyResponseCountModule { }