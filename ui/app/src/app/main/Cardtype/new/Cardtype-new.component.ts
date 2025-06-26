import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'Cardtype-new',
  templateUrl: './Cardtype-new.component.html',
  styleUrls: ['./Cardtype-new.component.scss']
})
export class CardtypeNewComponent {
  @ViewChild("CardtypeForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}