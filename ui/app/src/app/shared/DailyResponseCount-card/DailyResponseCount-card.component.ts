import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './DailyResponseCount-card.component.html',
  styleUrls: ['./DailyResponseCount-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.DailyResponseCount-card]': 'true'
  }
})

export class DailyResponseCountCardComponent {


}