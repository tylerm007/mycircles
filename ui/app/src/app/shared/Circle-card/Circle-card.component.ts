import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Circle-card.component.html',
  styleUrls: ['./Circle-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Circle-card]': 'true'
  }
})

export class CircleCardComponent {


}