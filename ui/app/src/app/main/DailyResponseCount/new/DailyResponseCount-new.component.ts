import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'DailyResponseCount-new',
  templateUrl: './DailyResponseCount-new.component.html',
  styleUrls: ['./DailyResponseCount-new.component.scss']
})
export class DailyResponseCountNewComponent {
  @ViewChild("DailyResponseCountForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {'count_inner': '0', 'count_middle': '0', 'count_outer': '0'}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}