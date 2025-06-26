import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './CardSelection-card.component.html',
  styleUrls: ['./CardSelection-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.CardSelection-card]': 'true'
  }
})

export class CardSelectionCardComponent {


}