import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardtypeHomeComponent } from './home/Cardtype-home.component';
import { CardtypeNewComponent } from './new/Cardtype-new.component';
import { CardtypeDetailComponent } from './detail/Cardtype-detail.component';

const routes: Routes = [
  {path: '', component: CardtypeHomeComponent},
  { path: 'new', component: CardtypeNewComponent },
  { path: ':card_type', component: CardtypeDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Cardtype-detail-permissions'
      }
    }
  },{
    path: ':card_type/Card', loadChildren: () => import('../Card/Card.module').then(m => m.CardModule),
    data: {
        oPermission: {
            permissionId: 'Card-detail-permissions'
        }
    }
}
];

export const CARDTYPE_MODULE_DECLARATIONS = [
    CardtypeHomeComponent,
    CardtypeNewComponent,
    CardtypeDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardtypeRoutingModule { }