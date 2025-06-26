import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Response-card.component.html',
  styleUrls: ['./Response-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Response-card]': 'true'
  }
})

export class ResponseCardComponent {


}