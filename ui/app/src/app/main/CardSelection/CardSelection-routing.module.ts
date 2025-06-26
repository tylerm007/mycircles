import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardSelectionHomeComponent } from './home/CardSelection-home.component';
import { CardSelectionNewComponent } from './new/CardSelection-new.component';
import { CardSelectionDetailComponent } from './detail/CardSelection-detail.component';

const routes: Routes = [
  {path: '', component: CardSelectionHomeComponent},
  { path: 'new', component: CardSelectionNewComponent },
  { path: ':id', component: CardSelectionDetailComponent,
    data: {
      oPermission: {
        permissionId: 'CardSelection-detail-permissions'
      }
    }
  },{
    path: ':card_id/Response', loadChildren: () => import('../Response/Response.module').then(m => m.ResponseModule),
    data: {
        oPermission: {
            permissionId: 'Response-detail-permissions'
        }
    }
}
];

export const CARDSELECTION_MODULE_DECLARATIONS = [
    CardSelectionHomeComponent,
    CardSelectionNewComponent,
    CardSelectionDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardSelectionRoutingModule { }