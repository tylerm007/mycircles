import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Fellowship-card.component.html',
  styleUrls: ['./Fellowship-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Fellowship-card]': 'true'
  }
})

export class FellowshipCardComponent {


}