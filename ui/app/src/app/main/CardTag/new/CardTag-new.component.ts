import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'CardTag-new',
  templateUrl: './CardTag-new.component.html',
  styleUrls: ['./CardTag-new.component.scss']
})
export class CardTagNewComponent {
  @ViewChild("CardTagForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}