import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FellowshipHomeComponent } from './home/Fellowship-home.component';
import { FellowshipNewComponent } from './new/Fellowship-new.component';
import { FellowshipDetailComponent } from './detail/Fellowship-detail.component';

const routes: Routes = [
  {path: '', component: FellowshipHomeComponent},
  { path: 'new', component: FellowshipNewComponent },
  { path: ':name', component: FellowshipDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Fellowship-detail-permissions'
      }
    }
  },{
    path: ':fellowship_name/Card', loadChildren: () => import('../Card/Card.module').then(m => m.CardModule),
    data: {
        oPermission: {
            permissionId: 'Card-detail-permissions'
        }
    }
},{
    path: ':fellowship_name/Tag', loadChildren: () => import('../Tag/Tag.module').then(m => m.TagModule),
    data: {
        oPermission: {
            permissionId: 'Tag-detail-permissions'
        }
    }
},{
    path: ':fellowship_name/User', loadChildren: () => import('../User/User.module').then(m => m.UserModule),
    data: {
        oPermission: {
            permissionId: 'User-detail-permissions'
        }
    }
}
];

export const FELLOWSHIP_MODULE_DECLARATIONS = [
    FellowshipHomeComponent,
    FellowshipNewComponent,
    FellowshipDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FellowshipRoutingModule { }