import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Tag-card.component.html',
  styleUrls: ['./Tag-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Tag-card]': 'true'
  }
})

export class TagCardComponent {


}