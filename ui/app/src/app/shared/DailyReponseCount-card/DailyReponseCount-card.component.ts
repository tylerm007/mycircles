import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './DailyReponseCount-card.component.html',
  styleUrls: ['./DailyReponseCount-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.DailyReponseCount-card]': 'true'
  }
})

export class DailyReponseCountCardComponent {


}