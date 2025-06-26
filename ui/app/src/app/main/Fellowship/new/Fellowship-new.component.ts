import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'Fellowship-new',
  templateUrl: './Fellowship-new.component.html',
  styleUrls: ['./Fellowship-new.component.scss']
})
export class FellowshipNewComponent {
  @ViewChild("FellowshipForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}