import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {DAILYREPONSECOUNT_MODULE_DECLARATIONS, DailyReponseCountRoutingModule} from  './DailyReponseCount-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    DailyReponseCountRoutingModule
  ],
  declarations: DAILYREPONSECOUNT_MODULE_DECLARATIONS,
  exports: DAILYREPONSECOUNT_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DailyReponseCountModule { }