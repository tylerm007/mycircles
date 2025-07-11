import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { APP_CONFIG, ONTIMIZE_PROVIDERS, OntimizeWebModule } from 'ontimize-web-ngx';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIG } from './app.config';

import { O_AUTH_SERVICE } from 'ontimize-web-ngx';
import { KeycloakOptions, O_KEYCLOAK_OPTIONS, OKeycloakAuthService, OntimizeKeycloakModule } from 'ontimize-web-ngx-keycloak';

// Standard providers...
// Defining custom providers (if needed)...
export const customProviders: any = [
];

const keycloakOptions: KeycloakOptions = {
  config: {
    url: "http://localhost:8080",
    realm: "kcals",
    clientId: "alsclient"
  },
  initOptions: {
    onLoad: 'login-required'
  }
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OntimizeWebModule,
    
    OntimizeKeycloakModule,
    
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: APP_CONFIG, useValue: CONFIG },
    ONTIMIZE_PROVIDERS,
    
    { provide: O_AUTH_SERVICE, useValue: OKeycloakAuthService },
    { provide: O_KEYCLOAK_OPTIONS, useValue: keycloakOptions },
    
    ...customProviders
  ]
})
export class AppModule { }