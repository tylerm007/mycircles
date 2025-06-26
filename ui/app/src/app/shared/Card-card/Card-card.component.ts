import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Card-card.component.html',
  styleUrls: ['./Card-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Card-card]': 'true'
  }
})

export class CardCardComponent {


}