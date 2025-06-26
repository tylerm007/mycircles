import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './CardTag-card.component.html',
  styleUrls: ['./CardTag-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.CardTag-card]': 'true'
  }
})

export class CardTagCardComponent {


}