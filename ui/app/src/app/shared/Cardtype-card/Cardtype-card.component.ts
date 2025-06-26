import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Cardtype-card.component.html',
  styleUrls: ['./Cardtype-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Cardtype-card]': 'true'
  }
})

export class CardtypeCardComponent {


}