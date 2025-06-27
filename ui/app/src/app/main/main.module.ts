import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { OChartModule } from 'ontimize-web-ngx-charts';
import {OReportModule} from 'ontimize-web-ngx-report'
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

import { OntimizeKeycloakModule } from 'ontimize-web-ngx-keycloak';


@NgModule({
  imports: [
    SharedModule,
    OntimizeWebModule,
    MainRoutingModule,
    OChartModule,
    OReportModule
    
    ,OntimizeKeycloakModule
    
  ],
  declarations: [
    MainComponent
  ]
})
export class MainModule { }