import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardHomeComponent } from './home/Card-home.component';
import { CardNewComponent } from './new/Card-new.component';
import { CardDetailComponent } from './detail/Card-detail.component';

const routes: Routes = [
  {path: '', component: CardHomeComponent},
  { path: 'new', component: CardNewComponent },
  { path: ':id', component: CardDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Card-detail-permissions'
      }
    }
  },{
    path: ':card_id/CardSelection', loadChildren: () => import('../CardSelection/CardSelection.module').then(m => m.CardSelectionModule),
    data: {
        oPermission: {
            permissionId: 'CardSelection-detail-permissions'
        }
    }
},{
    path: ':card_id/CardTag', loadChildren: () => import('../CardTag/CardTag.module').then(m => m.CardTagModule),
    data: {
        oPermission: {
            permissionId: 'CardTag-detail-permissions'
        }
    }
}
];

export const CARD_MODULE_DECLARATIONS = [
    CardHomeComponent,
    CardNewComponent,
    CardDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardRoutingModule { }