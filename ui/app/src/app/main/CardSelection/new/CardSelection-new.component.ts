import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'CardSelection-new',
  templateUrl: './CardSelection-new.component.html',
  styleUrls: ['./CardSelection-new.component.scss']
})
export class CardSelectionNewComponent {
  @ViewChild("CardSelectionForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}